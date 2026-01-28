# Project Manager (Full-Stack)

Monorepo:

- `apps/web`: React 18 + Vite + TypeScript + Tailwind + Framer Motion
- `apps/api`: Node.js + Express + TypeScript + JWT + Prisma (Postgres) + Mongoose (Mongo) + Neo4j driver

## Prérequis

- Node.js 18+
- Docker (recommandé pour Postgres/Mongo/Neo4j)

## Démarrage rapide

### 1) Bases de données (Docker)

```bash
docker compose up -d
```

- Postgres: `localhost:5432`
- Mongo: `localhost:27017`
- Neo4j Browser: http://localhost:7474 (user: `neo4j`, pass: `password`)

### 2) Installer les dépendances

À la racine:

```bash
npm install
```

### 3) Configurer l’API

Copie l’exemple:

```bash
cp apps/api/.env.example apps/api/.env
```

### 4) Lancer en dev

```bash
npm run dev
```

## Wireframe (texte)

- Dashboard
  - Cartes projets (tri/filtre)
  - Stats rapides
  - Mini-graphe des connexions
- Projet (détail)
  - Objectifs, tâches, notes, pièces jointes
  - Graphe (React Flow)
  - Sidebar Chatbot IA
- Tâches (Kanban)
  - Colonnes + drag & drop
- Calendrier
- Recherche globale (dont sémantique)
- Paramètres

## Commits / push GitHub

On fera des commits incrémentaux (scaffold -> backend -> frontend -> features). Les commandes git seront proposées et tu valideras l’exécution.
