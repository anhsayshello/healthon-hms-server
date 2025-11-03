import { Router } from "express";
import patientService from "../services/patient.service";
import { authMiddlewares } from "../middlewares";
import type { Patient } from "@prisma/client";

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
    const { query, page, limit } = req.query;
    const result = await patientService.getPatients(
      query as string,
      Number(page),
      Number(limit)
    );
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
    const { page, limit, query } = req.query;
    console.log(page);
    const uid = req.uid as string;
    const result = await patientService.getPatientAppointments(
      uid,
      query as string,
      Number(page),
      Number(limit)
    );
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
