import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import app from "../../config/firebase";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";

export default async function setUserAccess(uid: string, disabled: boolean) {
  try {
    const user = await getAuth(app).getUser(uid);
    const email = user.email;

    if (user.disabled === disabled) {
      const status = disabled ? "revoked" : "granted";
      throw new AppError(`User access is already ${status}`, 400);
    }

    await getAuth(app).updateUser(uid, { disabled });
    await prisma.staff.update({
      where: { uid },
      data: {
        status: disabled ? "INACTIVE" : "ACTIVE",
      },
    });

    const action = disabled ? "Disabled" : "Enabled";
    return {
      message: `${action} ${email} `,
    };
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      const errorMessage = error.message;
      throw new AppError(errorMessage, 400);
    }
    throw new AppError("Failed to set user access", 400);
  }
}
