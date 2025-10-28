import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import appoitmentService from "../services/appointment.service";

const appointmentRouter = Router();

appointmentRouter.use(...authMiddlewares);

appointmentRouter.post("/", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const { doctor_id, type, appointment_date, time, note } = req.body;
    console.log(req.body, "body");
    const result = await appoitmentService.createAppointment(
      uid,
      doctor_id,
      appointment_date,
      time,
      type,
      note
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

appointmentRouter.post("/:id", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const { id } = req.params;
    const { status, reason, note } = req.body;
    const result = await appoitmentService.updateAppointmentById(
      uid,
      Number(id),
      status,
      reason,
      note
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

appointmentRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await appoitmentService.getAppointmentById(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default appointmentRouter;
