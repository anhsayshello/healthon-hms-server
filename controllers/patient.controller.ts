import { Router } from "express";
import patientService from "../services/patient.service";
import { authMiddlewares } from "../middlewares";
import type { Patient } from "../types/patient.type";

const patientRouter = Router();

patientRouter.use(...authMiddlewares);

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

patientRouter.post("/upsert", async (req, res, next) => {
  try {
    const {
      email,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      marital_status,
      address,
      emergency_contact_name,
      emergency_contact_number,
      relation,
      blood_group,
      allergies,
      medical_conditions,
      medical_history,
      insurance_provider,
      insurance_number,
      privacy_consent,
      service_consent,
      medical_consent,
    } = req.body;

    const uid = req.uid as string;
    const result = await patientService.upsertPatient({
      uid,
      email,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      marital_status,
      address,
      emergency_contact_name,
      emergency_contact_number,
      relation,
      blood_group,
      allergies,
      medical_conditions,
      medical_history,
      insurance_provider,
      insurance_number,
      privacy_consent,
      service_consent,
      medical_consent,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default patientRouter;
