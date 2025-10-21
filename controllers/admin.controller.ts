import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import doctorService from "../services/doctor.service";
import adminService from "../services/admin.service";

const adminRouter = Router();

adminRouter.use(...authMiddlewares);

adminRouter.get("/", async (req, res, next) => {
  try {
    // const uid = req?.uid as string;
    const result = await adminService.getUsers();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/", async (req, res, next) => {
  try {
    const { role } = req.body;
    const uid = req?.uid as string;
    const result = await adminService.setUserRole(uid, role);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default adminRouter;
