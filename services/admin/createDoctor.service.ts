import {
  type Doctor,
  Prisma,
  Role,
  type Staff,
  Status,
  Weekday,
} from "@prisma/client";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import app from "../../config/firebase";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";

export default async function createDoctor(
  working_days: Weekday[],
  start_time: string,
  close_time: string,
  doctor: Omit<
    Doctor,
    "uid" | "availability_status" | "created_at" | "updated_at"
  >
) {
  const { email, first_name, last_name, phone, photo_url } = doctor;

  let doctorUid = "";

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
    doctorUid = userRecord.uid;
    await getAuth(app).setCustomUserClaims(doctorUid, {
      role: Role.DOCTOR,
    });
    console.log(userRecord, "userRecord");
    console.log("Successfully created new user:", userRecord.uid);
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      console.log(error.message);
      throw new AppError(error.message, 400);
    }
    throw new AppError("Failed to create doctor", 500);
  }

  const newDoctor = await prisma.doctor.create({
    data: {
      uid: doctorUid,
      ...doctor,
      availability_status: Status.ACTIVE,
      working_days: {
        create: working_days.map((day) => ({
          day,
          start_time,
          close_time,
        })),
      },
    },
  });

  return newDoctor;
}
