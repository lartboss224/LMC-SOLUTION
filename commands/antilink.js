const { setAntilink, getAntilink, removeAntilink } = require('../lib/index');
const { BOT_IMAGE, SYSTEM_NAME, LINE } = require('../lib/brand');

async function handleAntilinkCommand(sock, chatId, args, senderId, isSenderAdmin, message) {
    try {
        args = (args || []).map(a => String(a).toLowerCase());
        const action = args[0];

        if (!action) {
            const existing = await getAntilink(chatId, 'on');
            const current = existing?.enabled ? '🟢 Activé' : '🔴 Désactivé';
            return await sock.sendMessage(chatId, {
                image: { url: BOT_IMAGE },
                caption: `💎 *LMC-SOLUTION*\n${LINE}\n🔗 ANTI-LIEN\n${LINE}\n📊 Statut : ${current}\n\n📌 Commandes :\n▸ antilink on\n▸ antilink off\n▸ antilink set delete\n▸ antilink set kick\n▸ antilink set warn\n${LINE}\n📍 ${SYSTEM_NAME}`
            }, { quoted: message });
        }

        switch (action) {
            case 'on': {
                const existing = await getAntilink(chatId, 'on');
                if (existing?.enabled) {
                    return await sock.sendMessage(chatId, { text: `💎 *LMC-SOLUTION*\n\n⚠️ Anti-Lien est déjà activé.` }, { quoted: message });
                }
                await setAntilink(chatId, 'on', 'delete');
                return await sock.sendMessage(chatId, { text: `💎 *LMC-SOLUTION*\n\n🔗 Anti-Lien : 🟢 Activé\n_Tous les liens seront supprimés._` }, { quoted: message });
            }
            case 'off': {
                await removeAntilink(chatId, 'on');
                return await sock.sendMessage(chatId, { text: `💎 *LMC-SOLUTION*\n\n🔗 Anti-Lien : 🔴 Désactivé` }, { quoted: message });
            }
            case 'set': {
                const setAction = args[1];
                if (!['delete', 'kick', 'warn'].includes(setAction)) {
                    return await sock.sendMessage(chatId, { text: `❌ Action invalide. Choisis : delete | kick | warn` }, { quoted: message });
                }
                await setAntilink(chatId, 'on', setAction);
                return await sock.sendMessage(chatId, { text: `✅ Action anti-lien : ${setAction}` }, { quoted: message });
            }
            default:
                return await sock.sendMessage(chatId, { text: `❌ Commande inconnue.\nUsage : antilink on | off | set delete/kick/warn` }, { quoted: message });
        }
    } catch (e) {
        console.error('❌ [antilink]', e.message);
        await sock.sendMessage(chatId, { text: `❌ Erreur : ${e.message}` }, { quoted: message });
    }
}

module.exports = { handleAntilinkCommand };
