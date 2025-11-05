import { Router } from "express";
import { appCheckVerification } from "../middlewares/appCheckVerification";
import authService from "../services/auth/auth.service";
import { authMiddlewares } from "../middlewares";
import medicalRecordService from "../services/medical-record";
import type { SearchQueryParams } from "../types";

const medicalRecordRouter = Router();

medicalRecordRouter.use(...authMiddlewares);

medicalRecordRouter.get("/", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const result = await medicalRecordService.getMedicalRecords(params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default medicalRecordRouter;
