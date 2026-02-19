import express, { type Express, urlencoded } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { WebSocketServer } from "ws";
import cors from "cors";

import { initPassport } from "./passport.js";
import authRoute from "./routes/auth.route.js";
import {
  COOKIE_MAX_AGE,
  GREEN_ASCII,
  RED_ASCII,
  YELLOW_ASCII,
} from "./contants.js";
import { GameManager } from "./GameManager.js";
import {
  authenticateSocket,
  sessionParser,
} from "./middleware/session.middleware.js";

const WS_PORT: number = Number(process.env.WS_PORT);

const app: Express = express();
const connection = new WebSocketServer({ port: WS_PORT || 8000 });

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true, limit: "100kb" }));
app.use(sessionParser);
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

initPassport();
app.use(passport.initialize());
app.use(passport.authenticate("session"));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Running" });
});
app.use("/auth", authRoute);

const gameManager = new GameManager();

// Note: Don't send message instantly after upgrade

connection.on("connection", async (socket, req) => {
  const player = await authenticateSocket(req, socket);

  if (!player) {
    console.log("Unauthorized");
    socket.send("Unauthorized");
    socket.close();
    return;
  }

  console.log("📬 ", player.email, "joined");

  gameManager.addPlayer(player, socket);

  socket.on("close", () => {
    console.log(YELLOW_ASCII, "DISCONNECT");

    gameManager.disconnectPlayer(player._id);
  });
});

export default app;
