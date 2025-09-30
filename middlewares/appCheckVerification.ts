import admin from "../config/firebase";
import AppError from "../utils/app-error";

export const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    throw new AppError("Unauthorized", 401);
  }
  try {
    const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
    console.log("App Check verified:", appCheckClaims);
    return next();
  } catch (error) {
    console.error("App Check verification failed:", error);
    throw new AppError("Unauthorized", 401);
  }
};
