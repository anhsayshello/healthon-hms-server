import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import staffService from "../services/staff/index";
import type { AppointmentParams, SearchQueryParams } from "../types";

const staffRouter = Router();

staffRouter.use(...authMiddlewares);

staffRouter.get("/", async (req, res, next) => {
  try {
    const params: AppointmentParams = req.query;
    const result = await staffService.getStaffs(params);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

staffRouter.get("/statistic", async (req, res, next) => {
  try {
    const result = await staffService.getStaffDashBoardStatistic();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

staffRouter.get("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await staffService.getStaffById(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default staffRouter;
