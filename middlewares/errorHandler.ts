import AppError from "../utils/app-error";
import type { Request, Response, NextFunction } from "express";

export default function errorHandler(
  error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError || error.name === "AppError") {
    return res.status(error.status).json({ error: error.message });
  } else if (error.code === "auth/argument-error") {
    return res.status(401).json({ error: "Invalid token" });
  } else if (error.code === "auth/id-token-expired") {
    return res.status(401).json({
      // error: "Token expired",
      // message: "Your session has expired. Please sign in again.",
      error: "Your session has expired. Please sign in again.",
    });
  }

  next(error);
}
