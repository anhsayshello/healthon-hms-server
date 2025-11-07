import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import doctorService from "../services/doctor/index";
import type { SearchQueryParams } from "../types";

const doctorRouter = Router();

doctorRouter.use(...authMiddlewares);

doctorRouter.get("/", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const result = await doctorService.getDoctors(params);
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

doctorRouter.get("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await doctorService.getDoctorById(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default doctorRouter;
