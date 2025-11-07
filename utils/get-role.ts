import { Role } from "@prisma/client";
import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase";

export default async function getRole(uid: string) {
  const currentUser = await getAuth(app).getUser(uid);

  const role = currentUser.customClaims?.role;
  const isAdmin = role === Role.ADMIN;
  const isDoctor = role === Role.DOCTOR;
  const isPatient = role === Role.PATIENT;
  const isNurse = role === Role.NURSE;
  const isLabTechnician = role === Role.LAB_TECHNICIAN;
  const isCashier = role === Role.CASHIER;
  const isStaff =
    role === Role.NURSE ||
    role === Role.LAB_TECHNICIAN ||
    role === Role.CASHIER;

  return {
    role,
    isAdmin,
    isDoctor,
    isPatient,
    isNurse,
    isLabTechnician,
    isCashier,
    isStaff,
  };
}
