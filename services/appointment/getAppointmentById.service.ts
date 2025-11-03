import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getAppointmentById(id: number) {
  const data = await prisma.appointment.findUnique({
    where: { id },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (!data) {
    throw new AppError("Appointment data not found", 404);
  }

  return { data };
}
