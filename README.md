# 💎 LMC-SOLUTION

Bot WhatsApp multi-device **sans préfixe** — tape simplement le nom d'une commande (ex. `menu`, `alive`, `kick`) et le bot répond directement.

Créé par **IB-SACKO** & **SALGA** · Propriétaire **L'ART BOSS** · Système **CENTRAL-HEX**

---

## ⚡ Connexion

1. Déploie le bot sur ton propre serveur/hébergeur Node.js.
2. Ouvre la page d'accueil (`/`) servie par `web.js`.
3. Entre ton numéro WhatsApp (avec l'indicatif pays) et clique sur **Obtenir le code**, ou choisis l'onglet **QR Code**.
4. Sur ton téléphone : WhatsApp → ⋮ → Appareils liés → Lier un appareil → Lier avec un numéro de téléphone → entre le code (ou scanne le QR).
5. C'est prêt : tape `menu` dans n'importe quelle conversation.

## 📋 Les 14 commandes

| Commande | Description |
|---|---|
| `menu` | Affiche le menu du bot |
| `owner` | Contacts des créateurs et du propriétaire |
| `alive` | État du bot (uptime, RAM) |
| `humm` | Récupère un média vue-unique (en réponse) |
| `info` | Informations sur le bot |
| `open` | Ouvre le groupe (admin) |
| `close` | Ferme le groupe (admin) |
| `warn @user` | Avertit un membre — expulsion auto à 3 (admin) |
| `hidetag <texte>` | Mentionne tout le monde sans afficher les noms (admin) |
| `antilink on/off` | Bloque les liens dans le groupe (admin) |
| `welcome on/off` | Message de bienvenue pour les nouveaux membres |
| `mode public/private` | Change le mode d'accès au bot (propriétaire) |
| `antidelete on/off` | Récupère les messages supprimés (propriétaire) |
| `kick @user` | Expulse un membre (admin) |

## ⚙️ Installation

```bash
git clone <ton-dépôt>
cd LMC-SOLUTION
npm install
cp .env.example .env
node web.js
```

Le serveur démarre sur le port `3000` (configurable via `PORT`). Plusieurs numéros peuvent être connectés en même temps.

### Fonctionnement 24/7

Le bot inclut un **auto-ping intégré** qui empêche les hébergeurs comme Render de le mettre en veille par inactivité (définis `APP_URL` dans le `.env`, ou laisse vide sur Render qui fournit l'URL automatiquement).

## 🔧 Configuration (`.env`)

| Variable | Rôle |
|---|---|
| `OWNER_NUMBER` / `OWNER_NAME` | Numéro et nom du propriétaire |
| `CREATOR_NUMBERS` / `CREATOR_NAMES` | Créateurs (séparés par une virgule) |
| `COMMAND_MODE` | `public` ou `private` par défaut |

## 👤 Créateurs & Communauté

- 🛠️ Créateurs : **IB-SACKO** (+224 621 963 059) & **SALGA** (+224 662 675 862)
- 👑 Propriétaire : **L'ART BOSS** (+224 626 279 409)
- 💎 Système : **CENTRAL-HEX**
 
