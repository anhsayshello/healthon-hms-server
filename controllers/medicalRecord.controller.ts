import { Router } from "express";
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

medicalRecordRouter.get("/today", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const uid = req?.uid as string;
    const result = await medicalRecordService.getTodayMedicalRecords(
      uid,
      params
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

medicalRecordRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await medicalRecordService.getMedicalRecordById(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default medicalRecordRouter;
