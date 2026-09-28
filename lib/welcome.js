const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('../lib/index');
const { SYSTEM_NAME, LINE } = require('./brand');
const { delay } = require('@whiskeysockets/baileys');

async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `💎 *LMC-SOLUTION*\n${LINE}\n👋 MESSAGE DE BIENVENUE\n${LINE}\n▸ welcome on — Activer\n▸ welcome set <message> — Message personnalisé\n▸ welcome off — Désactiver\n${LINE}\nVariables : {user} {group} {description}\n📍 ${SYSTEM_NAME}`,
            quoted: message
        });
    }

    const [command, ...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');

    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ Le message de bienvenue est déjà activé.', quoted: message });
        }
        await addWelcome(chatId, true, 'Bienvenue {user} dans {group} ! 🎉');
        return sock.sendMessage(chatId, { text: '✅ Message de bienvenue activé. Utilise *welcome set <message>* pour le personnaliser.', quoted: message });
    }

    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ Le message de bienvenue est déjà désactivé.', quoted: message });
        }
        await delWelcome(chatId);
        return sock.sendMessage(chatId, { text: '✅ Message de bienvenue désactivé pour ce groupe.', quoted: message });
    }

    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ Donne un message personnalisé. Exemple : welcome set Bienvenue dans le groupe !', quoted: message });
        }
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ Message de bienvenue personnalisé enregistré.', quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ Commande invalide.\nUtilise : welcome on | welcome set <message> | welcome off`,
        quoted: message
    });
}

async function handleGoodbye(sock, chatId, message, match) {
    const lower = match?.toLowerCase();

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📤 *Goodbye Message Setup*\n\n✅ *.goodbye on* — Enable goodbye messages\n🛠️ *.goodbye set Your custom message* — Set a custom goodbye message\n🚫 *.goodbye off* — Disable goodbye messages\n\n*Available Variables:*\n• {user} - Mentions the leaving member\n• {group} - Shows group name`,
            quoted: message
        });
    }

    if (lower === 'on') {
        if (await isGoodByeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ Goodbye messages are *already enabled*.', quoted: message });
        }
        await addGoodbye(chatId, true, 'Goodbye {user} 👋');
        return sock.sendMessage(chatId, { text: '✅ Goodbye messages *enabled* with simple message. Use *.goodbye set [your message]* to customize.', quoted: message });
    }

    if (lower === 'off') {
        if (!(await isGoodByeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ Goodbye messages are *already disabled*.', quoted: message });
        }
        await delGoodBye(chatId);
        return sock.sendMessage(chatId, { text: '✅ Goodbye messages *disabled* for this group.', quoted: message });
    }

    if (lower.startsWith('set ')) {
        const customMessage = match.substring(4);
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ Please provide a custom goodbye message. Example: *.goodbye set Goodbye!*', quoted: message });
        }
        await addGoodbye(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ Custom goodbye message *set successfully*.', quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ Invalid command. Use:\n*.goodbye on* - Enable\n*.goodbye set [message]* - Set custom message\n*.goodbye off* - Disable`,
        quoted: message
    });
}

module.exports = { handleWelcome, handleGoodbye };
// This code handles welcome and goodbye messages in a WhatsApp group using the Baileys library.
