import { createServer } from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./sockets/index.js";
import { env } from "./config/env.js";

async function start() {
  await connectDB();

  const httpServer = createServer(app);
  initSocket(httpServer);

  httpServer.listen(env.port, () => {
    console.log(`[server] Vikas API listening on http://localhost:${env.port}`);
    console.log(`[server] Socket.IO ready on the same port`);
    console.log(`[server] Routing via OSRM at ${env.osrmBaseUrl}`);
  });
}

start().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
