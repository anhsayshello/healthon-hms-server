import { cert, initializeApp } from "firebase-admin/app";

const app = initializeApp({
  credential: cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!)),
  projectId: "healthon-hms",
});

export default app;
