import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import type { Doctor, Staff, Weekday } from "@prisma/client";
import { requireAdmin } from "../middlewares/requireRoles";
import adminService from "../services/admin/index";
import type { Request, Response, NextFunction } from "express";

const adminRouter = Router();

adminRouter.use(...authMiddlewares, requireAdmin);

adminRouter.post(
  "/doctor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { working_days, start_time, close_time, doctor } = req.body as {
        working_days: Weekday[];
        start_time: string;
        close_time: string;
        doctor: Omit<
          Doctor,
          "uid" | "availability_status" | "created_at" | "updated_at"
        >;
      };
      console.log(doctor, "doctor");
      const result = await adminService.createDoctor(
        working_days,
        start_time,
        close_time,
        doctor
      );
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.post(
  "/staff",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props: Omit<Staff, "uid" | "status" | "created_at" | "updated_at"> =
        req.body;
      const result = await adminService.createStaff(props);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nextPageToken = req.query.nextPageToken as string | undefined;
      const result = await adminService.getFirebaseUsers(nextPageToken);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.patch(
  "/role",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid, role } = req.body;
      const result = await adminService.setStaffRole(uid, role);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.patch(
  "/access",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid, disabled } = req.body;
      const result = await adminService.setUserAccess(uid, disabled);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.get(
  "/user/:uid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      const result = await adminService.getUserById(uid as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

adminRouter.delete(
  "/:uid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      const result = await adminService.deleteUserById(uid as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default adminRouter;
