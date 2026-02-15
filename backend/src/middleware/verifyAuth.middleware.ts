import type { NextFunction, Request, Response } from "express";

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).json({
      success: false,
      loggedIn: req.isAuthenticated(),
      message: "Unauthorized request",
    });
  }
};
