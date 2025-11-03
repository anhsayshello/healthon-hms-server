import { Router } from "express";
import { appCheckVerification } from "../middlewares/appCheckVerification";
import authService from "../services/auth/auth.service";

const authRouter = Router();

authRouter.post("/", appCheckVerification, async (req, res, next) => {
  try {
    const { idToken } = req.body;
    console.log(idToken);
    const result = await authService.auth(idToken);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
