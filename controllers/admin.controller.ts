import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import adminService from "../services/admin.service";
import type { Doctor, Weekday } from "@prisma/client";

const adminRouter = Router();

adminRouter.use(...authMiddlewares);

adminRouter.get("/users", async (req, res, next) => {
  try {
    const nextPageToken = req.query.nextPageToken as string | undefined;
    const result = await adminService.getFirebaseUsers(nextPageToken);
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

adminRouter.delete("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await adminService.deleteUserById(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/create-doctor", async (req, res, next) => {
  try {
    const { working_days, doctor } = req.body as {
      working_days: Weekday[];
      doctor: Omit<
        Doctor,
        "uid" | "availability_status" | "created_at" | "updated_at"
      >;
    };
    console.log("working_days received:", working_days);
    const result = await adminService.createNewDoctor(working_days, doctor);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default adminRouter;
