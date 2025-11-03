import type { Role } from "@prisma/client";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import app from "../../config/firebase";

export default async function setStaffRole(uid: string, role: Role) {
  const STAFF_ROLES = ["ADMIN", "NURSE", "LAB_TECHNICIAN", "CASHIER"];
  try {
    if (!STAFF_ROLES.includes(role)) {
      throw new AppError(
        "Invalid staff role. Only ADMIN, NURSE, LAB_TECHNICIAN, and CASHIER are allowed.",
        400
      );
    }
    const staff = await prisma.staff.findUnique({
      where: { uid },
    });

    if (!staff) {
      throw new AppError("User is not staff member.", 404);
    }
    await prisma.staff.update({
      where: { uid },
      data: {
        role,
      },
    });

    await getAuth(app).setCustomUserClaims(uid, { role });

    return { message: `Role '${role}' has been assigned to ${staff.email}.` };
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      const errorMessage = error.message;
      throw new AppError(errorMessage, 400);
    }
    throw new AppError("Failed to set staff role", 400);
  }
}
