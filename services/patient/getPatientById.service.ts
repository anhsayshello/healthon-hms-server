import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getPatientById(uid: string) {
  const data = await prisma.patient.findUnique({ where: { uid } });
  if (!data) {
    throw new AppError("Patient data not found", 404);
  }

  return { data };
}
