require('dotenv').config();
// 🧹 Redirige le stockage temporaire hors de /tmp système (évite les erreurs
// ENOSPC sur certains hébergeurs) et nettoie automatiquement les vieux fichiers.
const fs = require('fs');
const path = require('path');

const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => {});
                }
            });
        }
    });
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const isOwnerOrSudo = require('./lib/isOwner');
const isAdmin = require('./lib/isAdmin');
const { Antilink } = require('./lib/antilink');
const { handleWelcome } = require('./lib/welcome');
const store = require('./lib/lightweight_store');

// ── Les 14 commandes de LMC-SOLUTION ────────────────────────────
const menuCommand = require('./commands/menu');
const ownerCommand = require('./commands/owner');
const aliveCommand = require('./commands/alive');
const hummCommand = require('./commands/humm');
const infoCommand = require('./commands/info');
const openCommand = require('./commands/open');
const closeCommand = require('./commands/close');
const warnCommand = require('./commands/warn');
const hideTagCommand = require('./commands/hidetag');
const { handleAntilinkCommand } = require('./commands/antilink');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const kickCommand = require('./commands/kick');
// ─────────────────────────────────────────────────────────────

const MODE_FILE = path.join(__dirname, 'data/messageCount.json');

function readIsPublic() {
    try {
        const data = JSON.parse(fs.readFileSync(MODE_FILE));
        return typeof data.isPublic === 'boolean' ? data.isPublic : true;
    } catch {
        return true;
    }
}
function writeIsPublic(isPublic) {
    let data = {};
    try { data = JSON.parse(fs.readFileSync(MODE_FILE)); } catch {}
    data.isPublic = isPublic;
    fs.writeFileSync(MODE_FILE, JSON.stringify(data, null, 2));
}

async function handleMessages(sock, messageUpdate) {
    let chatId = null;
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        chatId = message.key.remoteJid;
        const senderId = message.key.fromMe
            ? (sock.user?.id?.split(':')[0].split('@')[0] + '@s.whatsapp.net')
            : (message.key.participant || message.key.remoteJid);

        const isGroup = chatId.endsWith('@g.us');
        const isChannel = chatId.endsWith('@newsletter');
        if (isChannel) return;

        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);
        const isOwnerMsg = message.key.fromMe || senderIsOwnerOrSudo;

        // ── Antidelete : mémorise chaque message reçu (no-op si désactivé) ──
        try {
            if (message.message) storeMessage(sock, message);
        } catch (e) { /* non critique */ }

        // ── Antidelete : détection d'une suppression ──
        try {
            if (message.message?.protocolMessage?.type === 0) {
                await handleMessageRevocation(sock, message);
                return;
            }
        } catch (e) { /* non critique */ }

        // ── Anti-lien automatique (détection en continu dans les groupes) ──
        if (isGroup) {
            try { await Antilink(message, sock); } catch (e) { /* non critique */ }
        }

        // Extraction du texte du message
        const rawText = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            ''
        );
        if (!rawText) return;

        const parts = rawText.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        const argText = args.join(' ');

        const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

        // ── Mode privé : seul le propriétaire/créateur peut utiliser le bot ──
        const isPublic = readIsPublic();
        if (!isPublic && !isOwnerMsg) return;

        switch (cmd) {
            case 'menu':
            case 'help':
                await menuCommand(sock, chatId, message);
                break;

            case 'owner':
                await ownerCommand(sock, chatId, message);
                break;

            case 'alive':
                await aliveCommand(sock, chatId, message);
                break;

            case 'humm':
                await hummCommand(sock, chatId, senderId, quotedMessage, message);
                break;

            case 'info':
                await infoCommand(sock, chatId, message);
                break;

            case 'open':
                if (!isGroup) return;
                await openCommand(sock, chatId, senderId, message);
                break;

            case 'close':
                if (!isGroup) return;
                await closeCommand(sock, chatId, senderId, message);
                break;

            case 'warn':
                if (!isGroup) return;
                await warnCommand(sock, chatId, senderId, mentionedJids, message);
                break;

            case 'hidetag':
                if (!isGroup) return;
                await hideTagCommand(sock, chatId, senderId, argText, quotedMessage, message);
                break;

            case 'antilink': {
                if (!isGroup) return;
                const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
                if (!isSenderAdmin && !isOwnerMsg) {
                    await sock.sendMessage(chatId, { text: '❌ Réservé aux admins du groupe.' }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, args, senderId, isSenderAdmin, message);
                break;
            }

            case 'welcome':
                if (!isGroup) return;
                await welcomeCommand(sock, chatId, message);
                break;

            case 'mode': {
                if (!isOwnerMsg) {
                    await sock.sendMessage(chatId, { text: '❌ Seul le propriétaire peut changer le mode.' }, { quoted: message });
                    return;
                }
                const action = args[0]?.toLowerCase();
                if (!action || (action !== 'public' && action !== 'private')) {
                    await sock.sendMessage(chatId, {
                        text: `🌍 *Mode actuel :* ${readIsPublic() ? 'public' : 'private'}\n\nUsage : mode public | mode private`
                    }, { quoted: message });
                    return;
                }
                writeIsPublic(action === 'public');
                await sock.sendMessage(chatId, { text: `✅ Le bot est maintenant en mode *${action}*.` }, { quoted: message });
                break;
            }

            case 'antidelete': {
                if (!isOwnerMsg) {
                    await sock.sendMessage(chatId, { text: '❌ Réservé au propriétaire du bot.' }, { quoted: message });
                    return;
                }
                await handleAntideleteCommand(sock, chatId, message, args[0]?.toLowerCase());
                break;
            }

            case 'kick':
                if (!isGroup) return;
                await kickCommand(sock, chatId, senderId, mentionedJids, message);
                break;

            default:
                // Mot non reconnu → silence total (pas de spam dans les groupes)
                return;
        }
    } catch (error) {
        console.error('❌ Erreur dans le gestionnaire de messages:', error.message);
        if (chatId) {
            try {
                await sock.sendMessage(chatId, { text: '❌ Une erreur est survenue lors du traitement de la commande.' });
            } catch (e2) { /* ignore */ }
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        if (!id.endsWith('@g.us')) return;
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Erreur handleGroupParticipantUpdate:', error.message);
    }
}

async function handleStatus() { /* aucune fonctionnalité liée aux statuts dans LMC-SOLUTION */ }

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus
};
