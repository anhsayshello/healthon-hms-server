import { Router } from "express";
import { authMiddlewares } from "../middlewares";

const nurseRouter = Router();

nurseRouter.use(...authMiddlewares);

export default nurseRouter;
