import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getPatientInfomation(uid: string) {
  const patient = await prisma.patient.findUnique({ where: { uid } });
  if (!patient) {
    throw new AppError("Patient data not found", 404);
  }

  return patient;
}
