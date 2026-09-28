const settings = require('../settings');
const { BOT_IMAGE, SYSTEM_NAME, LINE } = require('../lib/brand');

async function ownerCommand(sock, chatId, message) {
    const creatorLines = settings.creatorNames
        .map((name, i) => `👤 *${name.trim()}* — +${settings.creatorNumbers[i]}`)
        .join('\n');

    const creatorVcards = settings.creatorNames.map((name, i) => ({
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name.trim()}\nTEL;waid=${settings.creatorNumbers[i]}:${settings.creatorNumbers[i]}\nEND:VCARD`
    }));

    const ownerVcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${settings.botOwner}\nTEL;waid=${settings.ownerNumber}:${settings.ownerNumber}\nEND:VCARD`;

    const caption = `💎 *LMC-SOLUTION*
${LINE}
🛠️ LE BOT A ÉTÉ CRÉÉ PAR
${creatorLines}

👑 PROPRIÉTAIRE
👤 *${settings.botOwner}* — +${settings.ownerNumber}

🏷️ SYSTÈME
📍 *${SYSTEM_NAME}*
${LINE}
🤖 Bot : ${settings.botName}
📦 Version : v${settings.version}
${LINE}
📲 Contacte-nous ci-dessous 👇`;

    try {
        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption
        }, { quoted: message });

        await sock.sendMessage(chatId, {
            contacts: { displayName: 'Créateurs LMC-SOLUTION', contacts: creatorVcards }
        });

        await sock.sendMessage(chatId, {
            contacts: { displayName: settings.botOwner, contacts: [{ vcard: ownerVcard }] }
        });
    } catch (e) {
        console.error('❌ [owner]', e.message);
        await sock.sendMessage(chatId, { text: caption }, { quoted: message });
    }
}

module.exports = ownerCommand;
