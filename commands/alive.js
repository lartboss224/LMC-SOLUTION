const settings = require('../settings');
const { BOT_IMAGE, SYSTEM_NAME, LINE } = require('../lib/brand');

function formatUptime(s) {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d > 0 ? d + 'j ' : ''}${h}h ${m}m`;
}

async function aliveCommand(sock, chatId, message) {
    try {
        const uptime = formatUptime(Math.floor(process.uptime()));
        const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

        const caption = `💎 *LMC-SOLUTION*
${LINE}
✅ EN LIGNE ET OPÉRATIONNEL
${LINE}
⏱️ Uptime  : ${uptime}
📦 Version : v${settings.version}
👤 Owner   : ${settings.botOwner}
💾 RAM     : ${ram} Mo
${LINE}
💡 Tape *menu* pour voir toutes les commandes
📍 ${SYSTEM_NAME}`;

        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption
        }, { quoted: message });

    } catch (e) {
        console.error('❌ [alive]', e.message);
        await sock.sendMessage(chatId, {
            text: `✅ *LMC-SOLUTION v${settings.version}* est en ligne !\n💡 Tape *menu* pour les commandes.`
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
