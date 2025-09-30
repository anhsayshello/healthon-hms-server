import { getAuth } from "firebase-admin/auth";
import AppError from "../utils/app-error";
import prisma from "../config/db";
import admin from "../config/firebase";
import { Role } from "@prisma/client";
import type { Patient } from "../types/patient.type";

const patientService = {
  async getPatientInfomation(uid: string) {
    const patient = await prisma.patient.findUnique({ where: { uid } });
    if (!patient) {
      throw new AppError("User not registered", 404);
    }

    return {
      role: Role.PATIENT,
      user: patient,
    };
  },
  async upsertPatient({
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
  }: Patient) {
    let user;
    try {
      user = await getAuth().getUser(uid);
    } catch {
      throw new AppError("User not found", 404);
    }

    const existingPatient = await prisma.patient.findUnique({ where: { uid } });
    if (!existingPatient && !user?.customClaims?.role) {
      await admin.auth().setCustomUserClaims(uid, { role: Role.PATIENT });
    }

    const data = {
      first_name: first_name,
      last_name: last_name,
      email,
      date_of_birth: date_of_birth,
      gender,
      phone,
      marital_status: marital_status,
      address,
      emergency_contact_name: emergency_contact_name,
      emergency_contact_number: emergency_contact_number,
      relation,
      blood_group: blood_group,
      allergies,
      medical_conditions: medical_conditions,
      medical_history: medical_history,
      insurance_provider: insurance_provider,
      insurance_number: insurance_number,
      privacy_consent: privacy_consent,
      service_consent: service_consent,
      medical_consent: medical_consent,
    };

    const patient = await prisma.patient.upsert({
      where: {
        uid,
      },
      update: data,
      create: {
        uid,
        ...data,
      },
    });
    console.log(patient);

    return {
      role: Role.PATIENT,
      user: patient,
    };
  },
};

export default patientService;
