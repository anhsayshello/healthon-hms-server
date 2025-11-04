import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import type { Patient } from "@prisma/client";
import patientService from "../services/patient/index";
import type { AppointmentParams, SearchQueryParams } from "../types";

const patientRouter = Router();

patientRouter.use(...authMiddlewares);

patientRouter.post("/upsert", async (req, res, next) => {
  try {
    const props: Omit<Patient, "uid"> = req.body;

    const uid = req.uid as string;
    const result = await patientService.upsertPatient(uid, props);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const result = await patientService.getPatients(params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/information", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const result = await patientService.getPatientInfomation(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/statistic", async (req, res, next) => {
  try {
    const uid = req.uid as string;
    const result = await patientService.getPatientDashboardStatistics(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/appointments", async (req, res, next) => {
  try {
    const params: AppointmentParams = req.query;
    const uid = req.uid as string;
    const result = await patientService.getPatientAppointments(uid, params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await patientService.getPatientById(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default patientRouter;
