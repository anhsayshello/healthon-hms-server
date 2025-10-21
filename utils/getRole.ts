import { Role } from "@prisma/client";
import { getAuth } from "firebase-admin/auth";

export default async function getRole(uid: string) {
  const currentUser = await getAuth().getUser(uid);

  const role = await currentUser.customClaims?.role;
  const isAdmin = role === Role.ADMIN;
  const isDoctor = role === Role.DOCTOR;
  const isPatient = role === Role.PATIENT;
  const isNurse = role === Role.NURSE;
  const isLabTechnician = role === Role.LAB_TECHNICIAN;
  const isCashier = role === Role.CASHIER;

  return {
    role,
    isAdmin,
    isDoctor,
    isPatient,
    isNurse,
    isLabTechnician,
    isCashier,
  };
}
