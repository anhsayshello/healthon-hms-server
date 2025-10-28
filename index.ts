import express from "express";
import cors from "cors";
import unknownEndpoint from "./middlewares/unknownEndpoint";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./controllers/auth.controller";
import patientRouter from "./controllers/patient.controller";
import appointmentRouter from "./controllers/appointment.controller";
import doctorRouter from "./controllers/doctor.controller";
import adminRouter from "./controllers/admin.controller";
import staffRouter from "./controllers/staff.controller";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/staff", staffRouter);
app.use("/patient", patientRouter);
app.use("/doctor", doctorRouter);
app.use("/appointment", appointmentRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
