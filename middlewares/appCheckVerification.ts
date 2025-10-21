import { getAppCheck } from "firebase-admin/app-check";
import AppError from "../utils/app-error";
import app from "../config/firebase";

export const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    throw new AppError("Unauthorized", 401);
  }
  try {
    const appCheckClaims = await getAppCheck(app).verifyToken(appCheckToken);
    console.log("App Check verified:", appCheckClaims);
    return next();
  } catch (error) {
    console.error("App Check verification failed:", error);
    throw new AppError("Unauthorized", 401);
  }
};
