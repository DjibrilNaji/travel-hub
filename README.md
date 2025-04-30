# Guide d'installation rapide – Travel Hub avec Docker Compose

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé sur votre machine
- [Git](https://git-scm.com/) (pour cloner le projet, si besoin)

---

## Installation & lancement

1. **Clonez ce dépôt** (si ce n'est pas déjà fait) :

```bash
git clone https://github.com/DjibrilNaji/travel-hub.git
cd travel-hub
```

2. **Lancez tous les services avec Docker Compose :**

```bash
docker compose up -d
```

Cela démarre Next.js, MongoDB, Neo4j, Redis, etc.  
L'application Next.js sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## Configuration importante

**Ne modifiez pas les variables d'environnement pour pointer sur `localhost` :**

- Dans Docker Compose, chaque service communique via le nom du service (ex : `mongodb`, `neo4j`, `redis`), jamais `localhost`.

Exemple de `.env` (déjà prêt dans le projet) :

```env
MONGODB_URI=mongodb://root:root@mongodb:27017/
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4jpassword
REDIS_HOST=redis
REDIS_PORT=6379
```

---

## Insérer des données de test (seeds)

### Pour Neo4j

- Les requêtes Cypher de seed sont dans le dossier [`seed/neo4j`](./seed/neo4j).
- Pour les insérer :
  1. Ouvrez **Neo4j Browser** (généralement sur [http://localhost:7474](http://localhost:7474)).
  2. Connectez-vous avec les identifiants du `.env`.
  3. **Copiez-collez** le contenu des fichiers du dossier `seed/neo4j` dans la console Cypher puis exécutez.

### Pour MongoDB

- Les fichiers JSON de seed sont dans [`seed/mongo`](./seed/mongo).
- Pour les insérer :
  1. Ouvrez **MongoDB Compass** (téléchargeable [ici](https://www.mongodb.com/try/download/compass)).
  2. Connectez-vous à votre base : `mongodb://root:root@localhost:27017/`
  3. Pour chaque collection, cliquez sur votre base > collection > **"Import Data"** et sélectionnez le JSON correspondant du dossier `seed/mongo`.

---

## Résumé

- Démarrage ultra-simple :

```bash
docker compose up -d
```

- Les services communiquent par leur nom (`mongodb`, `neo4j`, `redis`) dans Docker, pas par `localhost`.

- Les seeds sont à importer manuellement :
  - Neo4j : copier-coller dans Neo4j Browser depuis `seed/neo4j`
  - MongoDB : import JSON via Compass depuis `seed/mongo`
