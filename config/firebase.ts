import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { FIREBASE_SERVICE_ACCOUNT } from ".";

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT!);

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: "healthon-hms",
});

export default app;
