import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import doctorService from "../services/doctor.service";

const doctorRouter = Router();

doctorRouter.use(...authMiddlewares);

doctorRouter.get("/", async (req, res, next) => {
  try {
    const result = await doctorService.getDoctors();
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
