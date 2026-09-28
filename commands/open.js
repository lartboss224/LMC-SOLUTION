// open → Ouvre le groupe (tout le monde peut écrire)
const isAdmin = require('../lib/isAdmin');
const { BOT_IMAGE, SYSTEM_NAME, LINE } = require('../lib/brand');

async function openCommand(sock, chatId, senderId, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*' }, { quoted: message });
    }

    const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isSenderAdmin) {
        return await sock.sendMessage(chatId, { text: '❌ Réservé aux admins du groupe.' }, { quoted: message });
    }

    try {
        await sock.groupSettingUpdate(chatId, 'not_announcement');
        const meta = await sock.groupMetadata(chatId);

        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption: `💎 *LMC-SOLUTION*
${LINE}
🔓 GROUPE OUVERT
${LINE}
👥 ${meta.subject}
🌍 Tout le monde peut écrire
👤 Ouvert par @${senderId.split('@')[0]}
${LINE}
💡 Pour fermer : *close*
📍 ${SYSTEM_NAME}`,
            mentions: [senderId]
        }, { quoted: message });
    } catch (e) {
        console.error('❌ [open]', e.message);
        await sock.sendMessage(chatId, { text: "❌ Impossible d'ouvrir le groupe.\n_Vérifie les permissions du bot._" }, { quoted: message });
    }
}

module.exports = openCommand;
