import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import staffService from "../services/staff/index";
import type { AppointmentParams } from "../types";
import type { Request, Response, NextFunction } from "express";

const staffRouter = Router();

staffRouter.use(...authMiddlewares);

staffRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: AppointmentParams = req.query;
      const result = await staffService.getStaffs(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

staffRouter.get(
  "/statistic",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffService.getStaffDashBoardStatistic();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

staffRouter.get(
  "/:uid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      const result = await staffService.getStaffById(uid as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default staffRouter;
