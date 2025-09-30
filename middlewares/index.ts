import { appCheckVerification } from "./appCheckVerification";
import { verifyIdToken } from "./verifyIdToken";

export const authMiddlewares = [appCheckVerification, verifyIdToken];
