import { Router, type Request, type Response } from "express";
import passport from "passport";
import { verifyAuth } from "../middleware/verifyAuth.middleware.js";

const router: Router = Router();

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["openid", "profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL || "http://localhost:5173",
    failureRedirect: "/login/failed",
  }),
);
router.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({
    success: false,
    loggedIn: req.isAuthenticated(),
    message: "Login failure",
  });
});

router.get("/me", verifyAuth, (req, res) => {
  res.status(200).json({
    success: true,
    loggedIn: req.isAuthenticated(),
    user: req.user,
    message: "User data fetch successfully",
  });
});

router.get("/logout", (req, res, next) => {
  res.clearCookie;
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      loggedIn: req.isAuthenticated(),
      message: "Logout Successfully",
    });
  });
});

export default router;
