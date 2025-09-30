import { getAuth } from "firebase-admin/auth";
import { getTokenFrom } from "../utils/utils";
import AppError from "../utils/app-error";

export const verifyIdToken = async (req, res, next) => {
  const idToken = getTokenFrom(req);

  if (!idToken) {
    throw new AppError("Invalid token", 401);
  }
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;

    return next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
