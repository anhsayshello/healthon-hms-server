import { getAuth } from "firebase-admin/auth";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";
import { Role } from "@prisma/client";
import app from "../../config/firebase";

const authService = {
  async auth(uid: string) {
    let userAuth;
    try {
      userAuth = await getAuth(app).getUser(uid);
    } catch (error: any) {
      throw new AppError(`Firebase error: ${error.message}`, 404);
    }
    const role = userAuth.customClaims?.role;

    if (role) {
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
          throw new AppError(`Unknown role: ${role}`, 400);
      }
      return { role, data: user };
    }

    return {
      role: null,
      data: null,
    };
  },
};

export default authService;
