import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import nurseService from "../services/nurse";
import type { SearchQueryParams } from "../types";
import type { VitalSigns } from "@prisma/client";

const nurseRouter = Router();

nurseRouter.use(...authMiddlewares);

nurseRouter.post("/vital-signs", async (req, res, next) => {
  try {
    const { appointment_id, props } = req.body as {
      appointment_id: number;
      props: Omit<
        VitalSigns,
        "id" | "patient_id" | "medical_id" | "created_at" | "updated_at"
      >;
    };
    const result = await nurseService.createVitalSigns(appointment_id, props);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

nurseRouter.get("/vital-signs", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const result = await nurseService.getVitalSignsToday(params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default nurseRouter;
