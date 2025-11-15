import { Router } from "express";
import { appCheckVerification } from "../middlewares/appCheckVerification";
import authService from "../services/auth/auth.service";
import type { Request, Response, NextFunction } from "express";

const authRouter = Router();

authRouter.post(
  "/",
  appCheckVerification,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken } = req.body;
      const result = await authService.auth(idToken);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
