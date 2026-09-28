const settings = require('../settings');
const { BOT_IMAGE, SYSTEM_NAME, LINE } = require('../lib/brand');

function heure() {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function dateJour() {
    return new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function menuCommand(sock, chatId, message) {
    const pushName = message.pushName || 'Utilisateur';

    const caption = `💎 *LMC-SOLUTION*
${LINE}
🤖 Bot        : ${settings.botName}
👤 Utilisateur : ${pushName}
🛠️ Développeurs : ${settings.creatorNames.join(' & ')}
⏰ Heure       : ${heure()}
📅 Date        : ${dateJour()}
${LINE}
              📍 ${SYSTEM_NAME}
${LINE}
📂 GÉNÉRAL
${LINE}
▸ menu → afficher le menu
▸ owner → propriétaire
▸ alive → état du bot
▸ humm → coup d'œil (vue unique)
▸ info → infos du bot
▸ open → ouvrir le groupe
▸ close → fermer le groupe
▸ warn @user → avertir un membre
▸ hidetag <texte> → tag caché
▸ antilink on/off → bloquer les liens
▸ welcome on/off → message de bienvenue
▸ mode public/private → change le mode
▸ antidelete on/off → anti-suppression
▸ kick @user → expulser un membre
${LINE}`;

    try {
        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption
        }, { quoted: message });
    } catch (e) {
        console.error('❌ [menu]', e.message);
        await sock.sendMessage(chatId, { text: caption }, { quoted: message });
    }
}

module.exports = menuCommand;
