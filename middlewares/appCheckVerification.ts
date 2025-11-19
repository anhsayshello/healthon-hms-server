import { getAppCheck } from "firebase-admin/app-check";
import AppError from "../utils/app-error";
import app from "../config/firebase";
import type { Request, Response, NextFunction } from "express";

export const appCheckVerification = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    throw new AppError("Unauthorized", 401);
  }
  try {
    // const appCheckClaims =
    await getAppCheck(app).verifyToken(appCheckToken);
    console.log("App Check verified");
    return next();
  } catch (error) {
    console.error("App Check verification failed:", error);
    throw new AppError("Unauthorized", 401);
  }
};
