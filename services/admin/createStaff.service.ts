import type { Staff } from "@prisma/client";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import app from "../../config/firebase";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";

export default async function createStaff(
  props: Omit<Staff, "uid" | "status" | "created_at" | "updated_at">
) {
  const { email, first_name, last_name, phone, photo_url, role } = props;

  let staffUid = "";

  try {
    const userRecord = await getAuth(app).createUser({
      email,
      emailVerified: false,
      phoneNumber: phone,
      password: "12345678",
      displayName: `${first_name} ${last_name}`,
      photoURL: photo_url,
      disabled: false,
    });
    staffUid = userRecord.uid;
    await getAuth(app).setCustomUserClaims(staffUid, {
      role,
    });

    console.log(userRecord, "userRecord");
    console.log("Successfully created new user:", userRecord.uid);
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      console.log(error.message);
      throw new AppError(error.message, 400);
    }
    throw new AppError("Failed to create staff", 500);
  }

  const newStaff = await prisma.staff.create({
    data: {
      uid: staffUid,
      ...props,
    },
  });

  return newStaff;
}
