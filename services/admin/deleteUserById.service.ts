import { Role } from "@prisma/client";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import app from "../../config/firebase";

export default async function deleteUserById(uid: string) {
  try {
    const user = await getAuth(app).getUser(uid);
    const email = user.email;
    const role = user.customClaims?.role as Role;

    if (role) {
      switch (role) {
        case Role.PATIENT:
          await prisma.patient.deleteMany({ where: { uid } });
          break;
        case Role.DOCTOR:
          await prisma.doctor.deleteMany({ where: { uid } });
          break;
        case Role.ADMIN:
        case Role.NURSE:
        case Role.LAB_TECHNICIAN:
        case Role.CASHIER:
          await prisma.staff.deleteMany({ where: { uid } });
          break;
        default:
          break;
      }
    }

    await getAuth(app).deleteUser(uid);

    return { message: `Deleted ${email}` };
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      const errorMessage = error.message;
      throw new AppError(errorMessage, 400);
    }
    throw new AppError("Failed to delete user", 400);
  }
}
