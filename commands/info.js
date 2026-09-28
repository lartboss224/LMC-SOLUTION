const settings = require('../settings');
const { BOT_IMAGE, SYSTEM_NAME, LINE } = require('../lib/brand');
const fs = require('fs');
const path = require('path');

function readIsPublic() {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/messageCount.json')));
        return typeof data.isPublic === 'boolean' ? data.isPublic : true;
    } catch { return true; }
}

async function infoCommand(sock, chatId, message) {
    const caption = `💎 *LMC-SOLUTION*
${LINE}
ℹ️ INFO BOT
${LINE}
🤖 Nom       : ${settings.botName}
📦 Version   : v${settings.version}
🛠️ Créateurs : ${settings.creatorNames.join(' & ')}
👑 Owner     : ${settings.botOwner}
🌍 Mode      : ${readIsPublic() ? 'Public' : 'Private'}
✅ Statut    : En ligne 24/7
🛡️ Commandes : 14
${LINE}
🏷️ Communauté : ${SYSTEM_NAME}
${LINE}`;

    await sock.sendMessage(chatId, {
        image: { url: BOT_IMAGE },
        caption
    }, { quoted: message });
}

module.exports = infoCommand;
