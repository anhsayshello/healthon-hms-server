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
import medicalRecordRouter from "./controllers/medicalRecord.controller";
import nurseRouter from "./controllers/nurse.controller";
import labRouter from "./controllers/lab.controller";
import medicationRouter from "./controllers/medication.controller";
import cashierRouter from "./controllers/cashier.controller";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://healthon.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Firebase-AppCheck"],
  })
);

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/nurse", nurseRouter);
app.use("/staff", staffRouter);
app.use("/patient", patientRouter);
app.use("/doctor", doctorRouter);
app.use("/appointment", appointmentRouter);
app.use("/medication", medicationRouter);
app.use("/medical-record", medicalRecordRouter);
app.use("/lab", labRouter);
app.use("/cashier", cashierRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
