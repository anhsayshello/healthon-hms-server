import { Role } from "@prisma/client";
import prisma from "../../config/db";
import getRole from "../../utils/get-role";
import AppError from "../../utils/app-error";

export default async function getUserById(uid: string) {
  const { role } = await getRole(uid);

  let user = null;

  switch (role) {
    case Role.PATIENT:
      user = await prisma.patient.findUnique({ where: { uid } });
      break;
    case Role.DOCTOR:
      user = await prisma.doctor.findUnique({ where: { uid } });
      break;
    case Role.ADMIN:
    case Role.NURSE:
    case Role.LAB_TECHNICIAN:
    case Role.CASHIER:
      user = await prisma.staff.findUnique({ where: { uid } });
      break;
    default:
      throw new AppError("User not found", 404);
  }

  return user;
}
