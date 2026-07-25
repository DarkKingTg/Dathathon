import neo4j from "neo4j-driver";

const uri = process.env.NEO4J_URI ?? "bolt://localhost:7687";
const user = process.env.NEO4J_USER ?? "neo4j";
const password = process.env.NEO4J_PASSWORD ?? "password";

export const neo4jDriver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  disableLosslessIntegers: true,
});

export const createNeo4jConstraints = async (): Promise<void> => {
  const session = neo4jDriver.session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    await Promise.race([
      session.executeWrite((tx) =>
        tx.run(`
          CREATE CONSTRAINT IF NOT EXISTS FOR (p:Person) REQUIRE p.person_id IS UNIQUE;
        `),
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Neo4j connection timeout")), 3000),
      ),
    ]);
  } finally {
    await session.close().catch(() => {});
  }
};

export const closeNeo4jDriver = async (): Promise<void> => {
  await neo4jDriver.close();
};
