import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import appointmentService from "../services/appointment/index";
import type { AppointmentParams } from "../types";
import type { Request, Response, NextFunction } from "express";
import type { Appointment } from "@prisma/client";

const appointmentRouter = Router();

appointmentRouter.use(...authMiddlewares);

appointmentRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.uid as string;
      const props: Pick<
        Appointment,
        "doctor_id" | "appointment_date" | "time" | "type" | "reason"
      > = req.body;
      const result = await appointmentService.createAppointment(uid, props);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

appointmentRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: AppointmentParams = req.query;
      const result = await appointmentService.getAppointments(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

appointmentRouter.get(
  "/doctor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.uid as string;
      const params: AppointmentParams = req.query;
      const result = await appointmentService.getDoctorAppointments(
        uid,
        params
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

appointmentRouter.get(
  "/patient",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: AppointmentParams = req.query;
      const uid = req.uid as string;
      const result = await appointmentService.getPatientAppointments(
        uid,
        params
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

appointmentRouter.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

appointmentRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await appointmentService.getAppointmentById(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default appointmentRouter;
