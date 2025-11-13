import { Router } from "express";
import type { Medication } from "@prisma/client";
import medicationService from "../services/medication";
import type { SearchQueryParams } from "../types";

const medicationRouter = Router();

medicationRouter.post("/", async (req, res, next) => {
  try {
    const props: Omit<Medication, "id" | "created_at" | "updated_at"> =
      req.body;
    const result = await medicationService.createMedication(props);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

medicationRouter.get("/", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.params;
    const result = await medicationService.getMedications(params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

medicationRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const props: Omit<Medication, "id" | "created_at" | "updated_at"> =
      req.body;
    const result = await medicationService.updateMedication(Number(id), props);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// medicationRouter.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const result = await medicationService.getMedicationById(id);
//     return res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// });

medicationRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await medicationService.deleteMedication(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default medicationRouter;
