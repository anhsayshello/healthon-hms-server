import { getAuth } from "firebase-admin/auth";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";
import app from "../../config/firebase";
import { Role, type Patient } from "@prisma/client";

export default async function upsertPatient(
  uid: string,
  props: Omit<Patient, "uid">
) {
  const { date_of_birth } = props;
  const dobISO = new Date(`${date_of_birth}T00:00:00.000Z`);

  let user;
  try {
    user = await getAuth(app).getUser(uid);
  } catch {
    throw new AppError("User not found", 404);
  }

  const existingPatient = await prisma.patient.findUnique({ where: { uid } });
  if (!existingPatient && !user?.customClaims?.role) {
    await getAuth(app).setCustomUserClaims(uid, { role: Role.PATIENT });
  }

  const data = {
    ...props,
    date_of_birth: dobISO,
  };

  const patient = await prisma.patient.upsert({
    where: {
      uid,
    },
    update: { ...props, date_of_birth: dobISO },
    create: {
      uid,
      ...data,
    },
  });
  console.log(patient);

  return {
    role: Role.PATIENT,
    data: patient,
  };
}
