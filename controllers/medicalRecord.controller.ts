import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import medicalRecordService from "../services/medical-record";
import type { SearchQueryParams } from "../types";
import type { Diagnosis, Prescription } from "@prisma/client";

const medicalRecordRouter = Router();

medicalRecordRouter.use(...authMiddlewares);

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

medicalRecordRouter.get("/", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const result = await medicalRecordService.getMedicalRecords(params);
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

medicalRecordRouter.post("/diagnoses", async (req, res, next) => {
  try {
    const props: Omit<
      Diagnosis,
      "id" | "doctor_id" | "created_at" | "updated_at"
    > = req.body;
    const uid = req?.uid as string;

    const result = await medicalRecordService.createDiagnosis(uid, props);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

medicalRecordRouter.patch("/diagnoses/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const props: Pick<
      Diagnosis,
      "symptoms" | "diagnosis" | "notes" | "follow_up_plan"
    > = req.body;
    const result = await medicalRecordService.updateDiagnosis(
      Number(id),
      props
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

medicalRecordRouter.delete("/diagnoses/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await medicalRecordService.deleteDiagnosis(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

medicalRecordRouter.post("/prescriptions", async (req, res, next) => {
  try {
    const props: Omit<Prescription, "id" | "created_at" | "updated_at"> =
      req.body;
    const result = await medicalRecordService.createPrescription(props);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

medicalRecordRouter.patch("/prescriptions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const props: Omit<
      Prescription,
      "id" | "medical_record_id" | "medication_id" | "created_at" | "updated_at"
    > = req.body;
    const result = await medicalRecordService.updatePrescription(
      Number(id),
      props
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

medicalRecordRouter.delete("/prescriptions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await medicalRecordService.deletePrescription(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default medicalRecordRouter;
