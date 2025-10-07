# CodeArena_EcoleIT_Pisc
Piscine M1 EcoleIT Projet CodeArena: Plateforme de compétition de code en temps réel avec sandbox Docker, authentification JWT et classement multijoueur.

# 🎮 CodeArena

Plateforme de compétition de code en temps réel permettant aux développeurs de résoudre des défis de programmation, participer à des concours et améliorer leurs compétences.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** - Système d'inscription et connexion sécurisé
- 📚 **Bibliothèque de problèmes** - Large collection de défis de programmation
- 🏆 **Concours en temps réel** - Compétitions avec classement dynamique
- 🐳 **Exécution sandboxée** - Code exécuté dans des conteneurs Docker isolés
- 📊 **Système de scoring** - Suivi des performances et classement
- ⚡ **WebSocket temps réel** - Mises à jour instantanées des scores
- 🎯 **Support multi-langages** - JavaScript, Python, Java, C++

## 🛠 Technologies

### Backend
- **Node.js** + **Express** - API REST
- **MongoDB** + **Mongoose** - Base de données
- **Socket.io** - Communication temps réel
- **JWT** - Authentification
- **Docker** - Exécution sandboxée du code

### Frontend
- **Vue.js 3** - Framework frontend
- **Tailwind CSS** - Styling
- **Pinia** - Gestion d'état
- **Vue Router** - Navigation
- **Axios** - Requêtes HTTP

## 📦 Prérequis

- Node.js 20.x ou supérieur
- MongoDB 7.x
- Docker & Docker Compose
- npm ou yarn

## 🚀 Installation

### 1. Cloner le repository

\`\`\`bash
git clone https://github.com/AGL2304/CodeArena_EcoleIT_Pisc.git
cd codearena
\`\`\`

### 2. Installation du Backend

\`\`\`bash
cd backend
npm install
\`\`\`

Créez le fichier `.env` :

\`\`\`bash
cp .env.example .env
\`\`\`

Modifiez les variables d'environnement dans `.env` selon vos besoins.

### 3. Installation du Frontend

\`\`\`bash
cd ../frontend
npm install
\`\`\`

Créez le fichier `.env` :

\`\`\`bash
echo "VITE_API_URL=http://localhost:5000" > .env
\`\`\`

### 4. Build de l'image Docker sandbox

\`\`\`bash
cd ../docker
docker build -t codearena-sandbox -f Dockerfile.sandbox .
\`\`\`

## ⚙️ Configuration

### Backend (.env)

\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codearena
JWT_SECRET=votre_secret_super_securise
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
\`\`\`

### Frontend (.env)

\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

## 🎯 Utilisation

### Option 1 : Avec Docker Compose (Recommandé)

\`\`\`bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
\`\`\`

### Option 2 : Développement local

#### Terminal 1 - MongoDB
\`\`\`bash
# Démarrer MongoDB (si installé localement)
mongod
\`\`\`

#### Terminal 2 - Backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

#### Terminal 3 - Frontend
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### Accès à l'application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **MongoDB** : mongodb://localhost:27017

## 📁 Structure du projet

\`\`\`
codearena/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, etc.)
│   │   ├── controllers/     # Logique métier
│   │   ├── models/          # Modèles MongoDB
│   │   ├── routes/          # Routes API
│   │   ├── middleware/      # Middlewares (auth, etc.)
│   │   ├── utils/           # Utilitaires
│   │   └── server.js        # Point d'entrée
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── assets/          # Images, styles
│   │   ├── components/      # Composants Vue
│   │   ├── views/           # Pages
│   │   ├── stores/          # Pinia stores
│   │   ├── router/          # Configuration routing
│   │   ├── config/          # Config API
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker/
│   └── Dockerfile.sandbox   # Image pour exécution code
├── docker-compose.yml
└── README.md
\`\`\`

## 📡 API Documentation

### Authentification

#### POST /api/auth/register
Inscription d'un nouvel utilisateur

\`\`\`json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
\`\`\`

#### POST /api/auth/login
Connexion utilisateur

\`\`\`json
{
  "email": "john@example.com",
  "password": "securepass123"
}
\`\`\`

#### GET /api/auth/profile
Récupérer le profil utilisateur (authentifié)

### Problèmes

#### GET /api/challenges
Liste tous les problèmes

#### GET /api/challenges/:id
Détails d'un problème spécifique

#### POST /api/challenges
Créer un nouveau problème (admin)

### Soumissions

#### POST /api/submissions
Soumettre une solution

\`\`\`json
{
  "challengeId": "...",
  "code": "function solution() { ... }",
  "language": "javascript"
}
\`\`\`

#### GET /api/submissions/:id
Détails d'une soumission

### Concours

#### GET /api/contests
Liste des concours

#### GET /api/contests/:id
Détails d'un concours

#### POST /api/contests/:id/join
Rejoindre un concours

## 🧪 Tests

\`\`\`bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
\`\`\`

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- Votre Équipe - [GitHub](https://github.com/AGL2304)

## 🙏 Remerciements

- Inspiration : LeetCode, HackerRank, Codeforces
- Communauté open-source

---

**Fait avec ❤️ pour les développeurs**