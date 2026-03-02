import express, { type Express, urlencoded } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { initPassport } from "./passport.js";
import authRoute from "./routes/auth.route.js";
import { sessionParser } from "./middleware/session.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true, limit: "100kb" }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(sessionParser);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Running" });
});
app.use("/auth", authRoute);

export default app;
