import session from "express-session";
import { COOKIE_MAX_AGE } from "../contants.js";
import express from "express";
import { User } from "../models/user.model.js";
import type { WebSocket } from "ws";

// Express Session Middleware
export const sessionParser: express.RequestHandler = session({
  secret: process.env.SESSION_SECRET || "some-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: COOKIE_MAX_AGE },
});

export const authenticateSocket = async (
  req: any,
  socket: WebSocket,
): Promise<{
  _id: string;
  displayName: string;
  avatar: string | null | undefined;
  email: string;
} | null> => {
  return new Promise((resolve) => {
    sessionParser(req, {} as any, async (err) => {
      if (err) {
        socket.close();
        return;
      }

      const userId: string = (req as any).session?.passport?.user;

      if (!userId) return resolve(null);
      const user = await User.findById(userId);

      if (!user) return resolve(null);
      resolve({
        _id: user._id.toString(),
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
      });
    });
  });
};
