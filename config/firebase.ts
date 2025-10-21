import { applicationDefault, initializeApp } from "firebase-admin/app";

const app = initializeApp({
  credential: applicationDefault(),
  projectId: "healthon-hms",
});

export default app;
