import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";
import { authenticateSocket } from "./middleware/session.middleware.js";
import { GameManager } from "./GameManager.js";
import { YELLOW_ASCII } from "./contants.js";

dotenv.config();

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;

  const server = http.createServer(app);

  const wss = new WebSocketServer({ server });

  const gameManager = new GameManager();

  // Note: Don't send message instantly after upgrade

  wss.on("connection", async (socket, req) => {
    const player = await authenticateSocket(req, socket);

    if (!player) {
      console.log("Unauthorized");
      socket.send("Unauthorized");
      socket.close();
      return;
    }

    gameManager.addPlayer(player, socket);

    socket.on("close", () => {
      console.log(YELLOW_ASCII, "DISCONNECT");

      gameManager.disconnectPlayer(player._id);
    });
  });

  app.listen(PORT, () => {
    console.log(
      "\x1b[32m%s\x1b[0m",
      `⚙️  Server is running on port http://localhost:${PORT} ...`,
    );
  });
});
