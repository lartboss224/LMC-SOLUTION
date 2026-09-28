require('dotenv').config();

const settings = {
  packname: process.env.PACK_NAME || 'LMC-SOLUTION',
  author: process.env.PACK_AUTHOR || 'IB-SACKO & SALGA',
  botName: process.env.BOT_NAME || 'LMC-SOLUTION',

  // 👑 Propriétaire officiel du bot
  botOwner: process.env.OWNER_NAME || "L'ART BOSS",
  ownerNumber: process.env.OWNER_NUMBER || '224626279409',

  // 🛠️ Créateurs / développeurs du bot (accès total via sudo, voir data/userGroupData.json)
  creatorNames: (process.env.CREATOR_NAMES || 'IB-SACKO,SALGA').split(','),
  creatorNumbers: (process.env.CREATOR_NUMBERS || '224621963059,224662675862').split(','),

  system: process.env.SYSTEM_NAME || 'CENTRAL-HEX',

  prefix: '', // Bot sans préfixe : "menu" suffit
  giphyApiKey: process.env.GIPHY_API_KEY || '',
  commandMode: process.env.COMMAND_MODE || 'public',
  maxStoreMessages: 20,
  storeWriteInterval: 10000,
  description: 'Bot WhatsApp multifonctions - LMC-SOLUTION',
  version: process.env.BOT_VERSION || '1.0.0',
};

module.exports = settings;
