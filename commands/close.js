// close → Ferme le groupe (seuls les admins peuvent envoyer)
const isAdmin = require('../lib/isAdmin');
const { BOT_IMAGE, SYSTEM_NAME, LINE } = require('../lib/brand');

async function closeCommand(sock, chatId, senderId, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*' }, { quoted: message });
    }

    const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isSenderAdmin) {
        return await sock.sendMessage(chatId, { text: '❌ Réservé aux admins du groupe.' }, { quoted: message });
    }

    try {
        await sock.groupSettingUpdate(chatId, 'announcement');
        const meta = await sock.groupMetadata(chatId);

        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption: `💎 *LMC-SOLUTION*
${LINE}
🔒 GROUPE FERMÉ
${LINE}
👥 ${meta.subject}
👑 Seuls les admins peuvent écrire
👤 Fermé par @${senderId.split('@')[0]}
${LINE}
💡 Pour rouvrir : *open*
📍 ${SYSTEM_NAME}`,
            mentions: [senderId]
        }, { quoted: message });
    } catch (e) {
        console.error('❌ [close]', e.message);
        await sock.sendMessage(chatId, { text: "❌ Impossible de fermer le groupe.\n_Vérifie les permissions du bot._" }, { quoted: message });
    }
}

module.exports = closeCommand;
