import app from "./app";
import { logger } from "./lib/logger";
import { ensurePostgresSchema } from "./lib/dbInit";
import { createNeo4jConstraints } from "./lib/neo4j";
import { ensureQdrantCollection } from "./lib/qdrant";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const startServer = async (): Promise<void> => {
  try {
    await ensurePostgresSchema();
  } catch (error) {
    logger.warn({ err: error }, "PostgreSQL unavailable, continuing without it");
  }

  try {
    await createNeo4jConstraints();
  } catch (error) {
    logger.warn({ err: error }, "Neo4j unavailable, continuing without it");
  }

  try {
    await ensureQdrantCollection();
  } catch (error) {
    logger.warn({ err: error }, "Qdrant unavailable, continuing without it");
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
};

startServer();
