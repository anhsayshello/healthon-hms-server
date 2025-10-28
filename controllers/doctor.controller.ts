import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import doctorService from "../services/doctor.service";

const doctorRouter = Router();

doctorRouter.use(...authMiddlewares);

doctorRouter.get("/", async (req, res, next) => {
  try {
    const { query, page, limit } = req.query;
    const result = await doctorService.getDoctors(
      query as string,
      Number(page),
      Number(limit)
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

doctorRouter.get("/appointments", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const { query, page, limit } = req.query;

    const result = await doctorService.getDoctorAppointments(
      uid,
      query as string,
      Number(page),
      Number(limit)
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

doctorRouter.get("/statistic", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const result = await doctorService.getDoctorDashboardStatistics(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default doctorRouter;
