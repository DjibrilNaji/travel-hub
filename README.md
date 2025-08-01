# Quick Installation Guide – Travel Hub with Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine  
- [Git](https://git-scm.com/) (to clone the project, if needed)

---

## Installation & Startup

1. **Clone this repository** (if not already done):

    ```bash
    git clone https://github.com/DjibrilNaji/travel-hub.git
    cd travel-hub
    ```

2. **Start all services with Docker Compose:**

    ```bash
    docker compose up -d
    ```

    This will start Next.js, MongoDB, Neo4j, Redis, etc.  
    The Next.js app will be available at [http://localhost:3000](http://localhost:3000).

---

## Important Configuration

**Do not change environment variables to use `localhost`:**

- In Docker Compose, services communicate using their service names (e.g., `mongodb`, `neo4j`, `redis`), never `localhost`.

Example `.env` file (already provided in the project):

```env
MONGODB_URI=mongodb://root:root@mongodb:27017/
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4jpassword
REDIS_HOST=redis
REDIS_PORT=6379
```

---

## Insert Test Data (Seeds)

### For Neo4j

- Cypher seed queries are located in the [`seed/neo4j`](./seed/neo4j) folder.
- To insert them:
  1. Open **Neo4j Browser** (usually at [http://localhost:7474](http://localhost:7474)).
  2. Log in using the credentials from the `.env` file.
  3. **Copy and paste** the contents of the files in `seed/neo4j` into the Cypher console and execute.

### For MongoDB

- Seed JSON files are located in [`seed/mongo`](./seed/mongo).
- To insert them:
  1. Open **MongoDB Compass** (download it [here](https://www.mongodb.com/try/download/compass)).
  2. Connect to your database: `mongodb://root:root@localhost:27017/`
  3. For each collection, go to your database > collection > click **"Import Data"** then choose the matching JSON file from `seed/mongo`.

---

## Summary

- Start everything with:

```bash
docker compose up -d
```

- Services communicate using their service name (`mongodb`, `neo4j`, `redis`) inside Docker, not `localhost`.

- Seeds must be imported manually:
  - Neo4j : copy-paste into Neo4j Browser from `seed/neo4j`
  - MongoDB : import JSON via Compass from `seed/mongo`
