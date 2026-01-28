import { createServer } from "http";
import { Server, type Socket } from "socket.io";

import { createApp } from "./app.js";
import { connectMongo } from "./db/mongo.js";
import { prisma } from "./db/prisma.js";
import { closeNeo4j, getNeo4jDriver } from "./db/neo4j.js";
import { env } from "./env.js";

async function main() {
  const app = createApp();
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket: Socket) => {
    socket.on("ping", () => socket.emit("pong"));
  });

  await prisma.$connect();
  await connectMongo();
  await getNeo4jDriver().verifyConnectivity();

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    await closeNeo4j();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
