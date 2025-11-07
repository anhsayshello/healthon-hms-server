import { getAuth } from "firebase-admin/auth";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";
import { Role } from "@prisma/client";

const authService = {
  async auth(idToken: string) {
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch {
      throw new AppError("Invalid token", 401);
    }
    const uid = decodedToken.uid;

    let userAuth;
    try {
      userAuth = await getAuth().getUser(uid);
    } catch {
      throw new AppError("User not found", 404);
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
      return { idToken, role, data: user };
    }

    return {
      idToken: idToken,
      role: null,
      data: null,
    };
  },
};

export default authService;
