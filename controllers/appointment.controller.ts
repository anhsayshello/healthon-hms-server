import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import appointmentService from "../services/appointment/index";
import type { AppointmentParams } from "../types";

const appointmentRouter = Router();

appointmentRouter.use(...authMiddlewares);

appointmentRouter.post("/", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const { doctor_id, type, appointment_date, time, note } = req.body;
    const result = await appointmentService.createAppointment(
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

appointmentRouter.get("/", async (req, res, next) => {
  try {
    const params: AppointmentParams = req.query;
    console.log(params.query);
    const result = await appointmentService.getAppointments(params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

appointmentRouter.patch("/:id", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const { id } = req.params;
    const { status, reason, note } = req.body;
    const result = await appointmentService.updateAppointmentById(
      uid,
      Number(id),
      status,
      reason,
      note
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

appointmentRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await appointmentService.getAppointmentById(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default appointmentRouter;
