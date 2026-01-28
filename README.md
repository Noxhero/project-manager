# Project Manager - Application Full-Stack

Une application web moderne de gestion de projets avec IA intégrée et graphes sémantiques.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités implémentées

- **Authentification** : Connexion/inscription avec JWT
- **Dashboard** : Vue d'ensemble avec statistiques et animations
- **Gestion de projets** : Création, modification, suppression
- **Suivi des tâches** : Kanban avec drag & drop (React Beautiful DnD)
- **Chatbot IA** : Assistant intégré pour aider à la gestion de projets
- **Graphes sémantiques** : Visualisation des connexions entre projets (React Flow)
- **Calendrier** : Vue des deadlines et milestones (React Big Calendar)
- **Recherche globale** : Recherche full-text avec scoring
- **Paramètres** : Profil utilisateur, préférences, export/import
- **Mode offline** : Support PWA avec Service Worker
- **Animations** : Micro-interactions et transitions fluides (Framer Motion)

### 🏗️ Architecture

- **Frontend** : React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend** : Node.js + Express + TypeScript + JWT
- **Bases de données** :
  - PostgreSQL (via Prisma) : Données structurées (utilisateurs, logs)
  - MongoDB (via Mongoose) : Données flexibles (projets, tâches)
  - Neo4j : Graphes sémantiques (connexions entre projets)
- **State Management** : Redux Toolkit
- **UI/UX** : Design minimaliste, responsive, accessible (WCAG 2.1)

## 📋 Prérequis

- Node.js 18+
- Docker (recommandé pour les bases de données)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Noxhero/project-manager.git
cd project-manager
```

### 2. Démarrer les bases de données

```bash
docker compose up -d
```

Cela démarre :
- PostgreSQL sur `localhost:5433`
- MongoDB sur `localhost:27018`
- Neo4j sur `localhost:7474` (Browser) et `localhost:7688` (Bolt)

### 3. Installer les dépendances

```bash
npm install
```

### 4. Configurer l'environnement

```bash
cp apps/api/.env.example apps/api/.env
```

Éditez `apps/api/.env` avec vos configurations (clés JWT, URLs des bases de données).

### 5. Démarrer l'application

```bash
npm run dev
```

L'application sera disponible :
- Frontend : http://localhost:5173
- API : http://localhost:4000
- Neo4j Browser : http://localhost:7474

## 📱 Utilisation

### Première connexion

1. Accédez à http://localhost:5173
2. Créez un compte (email + mot de passe + nom/prénom)
3. Connectez-vous

### Créer un projet

1. Cliquez sur "Créer un projet" dans le dashboard
2. Remplissez le formulaire (nom, description, objectifs, tags, deadline)
3. Le projet apparaît dans votre dashboard

### Gérer les tâches

1. Accédez au détail d'un projet
2. Cliquez sur "+ Tâche" pour ajouter des tâches
3. Utilisez la vue Kanban pour organiser les tâches
4. Glissez-déposez les tâches entre colonnes

### Chatbot IA

Le chatbot (icône 🤖 en bas à droite) peut vous aider :
- Créer des projets
- Organiser des tâches
- Obtenir des recommandations
- Poser des questions sur vos projets

## 🎨 Design et UX

- **Thème** : Sombre par défaut, avec accents bleus
- **Responsive** : Adapté mobile, tablette, desktop
- **Animations** : Transitions fluides, micro-interactions
- **Accessibilité** : Conforme WCAG 2.1, navigation clavier
- **Performance** : Lazy loading, optimisation bundle (< 1MB)

## 🔧 Structure du projet

```
project-manager/
├── apps/
│   ├── web/                 # Frontend React
│   │   ├── src/
│   │   │   ├── components/  # Composants réutilisables
│   │   │   ├── pages/       # Pages de l'application
│   │   │   ├── app/         # Configuration Redux, router
│   │   │   └── utils/       # Utilitaires (offline, etc.)
│   │   └── public/
│   └── api/                 # Backend Node.js
│       ├── src/
│       │   ├── routes/      # Routes API
│       │   ├── models/      # Modèles Mongoose
│       │   ├── db/          # Configuration bases de données
│       │   └── http/        # Middleware, erreurs
│       └── prisma/          # Schéma PostgreSQL
├── docker-compose.yml       # Services Docker
└── package.json            # Scripts et dépendances
```

## 🚀 Déploiement

### Production

```bash
# Build frontend
cd apps/web && npm run build

# Build API
cd ../api && npm run build

# Démarrer en production
npm run start
```

### Docker

```bash
docker compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuer

1. Fork le repository
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajoute nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour les détails.

## 🙏 Remerciements

- React, TypeScript, Tailwind CSS
- Express, Prisma, Mongoose, Neo4j
- Framer Motion, React Flow, React Big Calendar
- React Beautiful DnD, React Hot Toast

---

**Développé avec ❤️ par [Noxhero](https://github.com/Noxhero)**
