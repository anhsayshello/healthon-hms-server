import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import adminService from "../services/admin.service";
import type { Doctor, Staff, Weekday } from "@prisma/client";
import { requireAdmin } from "../middlewares/requireAdmin";

const adminRouter = Router();

adminRouter.use(...authMiddlewares, requireAdmin);

adminRouter.post("/doctor", async (req, res, next) => {
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
});

adminRouter.post("/staff", async (req, res, next) => {
  try {
    const props: Omit<Staff, "uid" | "status" | "created_at" | "updated_at"> =
      req.body;
    const result = await adminService.createStaff(props);
    return res.status(201).json(result);
  } catch (error) {}
});

adminRouter.get("/statistic", async (req, res, next) => {
  try {
    const result = await adminService.getAdminDashboardStatistics();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/appointments", async (req, res, next) => {
  try {
    const { query, page, limit } = req.query;
    const result = await adminService.getAdminAppointments(
      query as string,
      Number(page),
      Number(limit)
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/users", async (req, res, next) => {
  try {
    const nextPageToken = req.query.nextPageToken as string | undefined;
    const result = await adminService.getFirebaseUsers(nextPageToken);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/role", async (req, res, next) => {
  try {
    const { uid, role } = req.body;
    const result = await adminService.setStaffRole(uid, role);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/access", async (req, res, next) => {
  try {
    const { uid, disabled } = req.body;
    const result = await adminService.setUserAccess(uid, disabled);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await adminService.getUserById(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await adminService.deleteUserById(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default adminRouter;
