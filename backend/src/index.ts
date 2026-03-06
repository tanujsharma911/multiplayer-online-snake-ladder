import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";
import http from "http";
import { Server, Socket } from "socket.io";
import {
  authenticateSocket,
  sessionParser,
} from "./middleware/session.middleware.js";
import { GameManager } from "./GameManager.js";
import { GREEN_ASCII, YELLOW_ASCII } from "./contants.js";
import passport from "passport";

dotenv.config();

connectDB().then(() => {
  const PORT = process.env.PORT || 4000;

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  const gameManager = new GameManager();

  io.use((socket, next) => {
    sessionParser(socket.request as any, {} as any, (err: any) => {
      if (err) return next(err);

      passport.initialize()(socket.request as any, {} as any, (err2: any) => {
        if (err2) return next(err2);

        passport.session()(socket.request as any, {} as any, next as any);
      });
    });
  });

  io.on("connection", async (socket: Socket) => {
    const user = socket.request as any;
    const player = user.user;

    if (!user.isAuthenticated()) {
      socket.emit("message", "Unauthorized");
      return;
    }

    gameManager.addPlayer(player, socket);

    socket.on("close", () => {
      gameManager.disconnectPlayer(player._id);
    });
  });

  server.listen(PORT, () => {
    console.log(
      "\x1b[32m%s\x1b[0m",
      `⚙️  Server is running on port http://localhost:${PORT} ...`,
    );
  });
});
