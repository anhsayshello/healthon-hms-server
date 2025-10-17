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

export default doctorRouter;
