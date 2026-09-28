// lib/brand.js — Constantes d'identité visuelle du bot LMC-SOLUTION
// Centralise le nom, l'image et les informations utilisées par les commandes.

const BOT_NAME = 'LMC-SOLUTION';
const BOT_IMAGE = 'https://i.ibb.co/MxH346HF/file-00000000cd4c8243abb6a1c5623a7bcd.png';

// 🛠️ Créateurs / développeurs du bot (accès total via sudo)
const CREATORS = [
    { name: 'IB-SACKO', number: '224621963059' },
    { name: 'SALGA', number: '224662675862' }
];

// 👑 Propriétaire officiel du bot
const OWNER_NAME = "L'ART BOSS";
const OWNER_NUMBER = '224626279409';

const SYSTEM_NAME = 'CENTRAL-HEX';

// Pas de contexte de transfert vers une chaîne WhatsApp externe : on reste neutre.
const channelInfo = {};

// ── Style visuel LMC-SOLUTION : lignes pleines + diamant, distinct des autres bots ──
const LINE = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';

function box(title, bodyLines) {
    return `💎 *${title}*\n${LINE}\n${bodyLines.join('\n')}\n${LINE}\n📍 _${SYSTEM_NAME}_`;
}

module.exports = {
    BOT_NAME,
    BOT_IMAGE,
    CREATORS,
    OWNER_NAME,
    OWNER_NUMBER,
    SYSTEM_NAME,
    channelInfo,
    LINE,
    box
};
