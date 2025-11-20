import { Router } from "express";
import authService from "../services/auth/auth.service";
import type { Request, Response, NextFunction } from "express";
import { authMiddlewares } from "../middlewares";

const authRouter = Router();

authRouter.post(
  "/",
  authMiddlewares,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.uid;
      const result = await authService.auth(uid);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
