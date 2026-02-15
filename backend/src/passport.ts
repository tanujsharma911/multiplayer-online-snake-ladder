import passport from "passport";
import { type Profile } from "passport-google-oauth20";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { User } from "./models/user.model.js";
import mongoose from "mongoose";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "your_google_client_id";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "your_google_client_id";

export const initPassport = () => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Missing environment variables for authentication providers",
    );
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        scope: ["openid", "profile", "email"],
      },
      async function verify(
        accessToken: any,
        refreshToken: any,
        profile: Profile,
        cb: any,
      ) {
        // console.dir(profile, { depth: null });

        const user = {
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || "",
          avatar: profile.photos?.[0]?.value || "",
        };

        const findUser = await User.findOne({ email: user.email });

        if (findUser) {
          return cb(null, findUser);
        } else {
          const newUser = await User.create(user);

          return cb(null, newUser);
        }
      },
    ),
  );

  passport.serializeUser((user: any, cb) => {
    process.nextTick(function () {
      return cb(null, user._id);
    });
  });

  passport.deserializeUser(async (id: string, cb) => {
    const userData = await User.findById(new mongoose.Types.ObjectId(id));

    process.nextTick(() => {
      return cb(null, userData);
    });
  });
};
