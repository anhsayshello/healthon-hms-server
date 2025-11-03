import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getDoctorById(uid: string) {
  const data = await prisma.doctor.findUnique({
    where: { uid },
    include: { working_days: true },
  });
  if (!data) {
    throw new AppError("Doctor data not found", 404);
  }

  return { data };
}
