import { Router } from "express";
import type { Medication } from "@prisma/client";
import medicationService from "../services/medication";
import type { SearchQueryParams } from "../types";
import type { Request, Response, NextFunction } from "express";

const medicationRouter = Router();

medicationRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props: Omit<Medication, "id" | "created_at" | "updated_at"> =
        req.body;
      const result = await medicationService.createMedication(props);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

medicationRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: SearchQueryParams = req.params;
      const result = await medicationService.getMedications(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

medicationRouter.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const props: Omit<Medication, "id" | "created_at" | "updated_at"> =
        req.body;
      const result = await medicationService.updateMedication(
        Number(id),
        props
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// medicationRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const result = await medicationService.getMedicationById(id);
//     return res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// });

medicationRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await medicationService.deleteMedication(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default medicationRouter;
