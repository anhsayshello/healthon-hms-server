import express from "express";
import cors from "cors";
import unknownEndpoint from "./middlewares/unknownEndpoint";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./controllers/auth.controller";
import patientRouter from "./controllers/patient.controller";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

const PORT = 3000;

app.use("/auth", authRouter);
app.use("/patient", patientRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
