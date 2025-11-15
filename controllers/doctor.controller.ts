import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import doctorService from "../services/doctor/index";
import type { SearchQueryParams } from "../types";
import type { Request, Response, NextFunction } from "express";

const doctorRouter = Router();

doctorRouter.use(...authMiddlewares);

doctorRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: SearchQueryParams = req.query;
      const result = await doctorService.getDoctors(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

doctorRouter.get(
  "/statistic",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.uid as string;
      const result = await doctorService.getDoctorDashboardStatistics(uid);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

doctorRouter.get(
  "/:uid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      const result = await doctorService.getDoctorById(uid as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

doctorRouter.patch(
  "/appointments/:appointment_id/start_consultation",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointment_id } = req.params;
      const uid = req.uid as string;
      const result = await doctorService.startConsultation(
        uid,
        Number(appointment_id)
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

doctorRouter.patch(
  "/appointments/:appointment_id/complete_consultation",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointment_id } = req.params;
      const uid = req.uid as string;
      const result = await doctorService.completeConsultation(
        uid,
        Number(appointment_id)
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default doctorRouter;
