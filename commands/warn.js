const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin');
const { SYSTEM_NAME, LINE } = require('../lib/brand');

const databaseDir = path.join(process.cwd(), 'data');
const warningsPath = path.join(databaseDir, 'warnings.json');

function initializeWarningsFile() {
    if (!fs.existsSync(databaseDir)) fs.mkdirSync(databaseDir, { recursive: true });
    if (!fs.existsSync(warningsPath)) fs.writeFileSync(warningsPath, JSON.stringify({}), 'utf8');
}

async function warnCommand(sock, chatId, senderId, mentionedJids, message) {
    try {
        initializeWarningsFile();

        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, { text: '❌ Cette commande ne fonctionne que dans les groupes.' }, { quoted: message });
        }

        try {
            const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
            if (!isSenderAdmin) {
                return await sock.sendMessage(chatId, { text: '❌ Réservé aux admins du groupe.' }, { quoted: message });
            }
        } catch (adminError) {
            console.error('Erreur vérification admin:', adminError);
            return await sock.sendMessage(chatId, { text: '❌ Vérifie que le bot est bien admin du groupe.' }, { quoted: message });
        }

        let userToWarn;
        if (mentionedJids && mentionedJids.length > 0) {
            userToWarn = mentionedJids[0];
        } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToWarn = message.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToWarn) {
            return await sock.sendMessage(chatId, { text: '❌ Mentionne la personne ou réponds à son message pour l\'avertir.' }, { quoted: message });
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            let warnings = {};
            try { warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8')); } catch { warnings = {}; }

            if (!warnings[chatId]) warnings[chatId] = {};
            if (!warnings[chatId][userToWarn]) warnings[chatId][userToWarn] = 0;

            warnings[chatId][userToWarn]++;
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

            const warningMessage = `💎 *LMC-SOLUTION*
${LINE}
⚠️ AVERTISSEMENT
${LINE}
👤 Membre averti : @${userToWarn.split('@')[0]}
📊 Total : ${warnings[chatId][userToWarn]}/3
👑 Averti par : @${senderId.split('@')[0]}
📅 ${new Date().toLocaleString('fr-FR')}
${LINE}
📍 ${SYSTEM_NAME}`;

            await sock.sendMessage(chatId, { text: warningMessage, mentions: [userToWarn, senderId] });

            if (warnings[chatId][userToWarn] >= 3) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await sock.groupParticipantsUpdate(chatId, [userToWarn], 'remove');
                delete warnings[chatId][userToWarn];
                fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

                await sock.sendMessage(chatId, {
                    text: `💎 *LMC-SOLUTION*\n${LINE}\n🚫 EXPULSION AUTOMATIQUE\n${LINE}\n@${userToWarn.split('@')[0]} a été expulsé après 3 avertissements.\n${LINE}\n📍 ${SYSTEM_NAME}`,
                    mentions: [userToWarn]
                });
            }
        } catch (error) {
            console.error('Erreur warn:', error);
            await sock.sendMessage(chatId, { text: "❌ Impossible d'avertir ce membre." }, { quoted: message });
        }
    } catch (error) {
        console.error('Erreur warn:', error);
        try {
            await sock.sendMessage(chatId, { text: '❌ Une erreur est survenue. Vérifie que le bot est admin du groupe.' }, { quoted: message });
        } catch (sendError) {
            console.error('Erreur envoi message:', sendError);
        }
    }
}

module.exports = warnCommand;
