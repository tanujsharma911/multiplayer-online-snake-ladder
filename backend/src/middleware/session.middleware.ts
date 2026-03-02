import session from "express-session";
import { COOKIE_MAX_AGE } from "../contants.js";
import express from "express";
import { User } from "../models/user.model.js";
import type { Socket } from "socket.io";

// Express Session Middleware
export const sessionParser: express.RequestHandler = session({
  secret: process.env.SESSION_SECRET || "some-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: COOKIE_MAX_AGE },
});

export const authenticateSocket = async (socket: Socket) => {
  return new Promise((resolve) => {
    sessionParser(socket.request as any, {} as any, async (err) => {
      if (err) {
        socket.disconnect(true);
        return;
      }

      const userId: string = (socket.request as any).session?.passport?.user;

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
