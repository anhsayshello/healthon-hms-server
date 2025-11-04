import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getAppointmentById(id: number) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (!appointment) {
    throw new AppError("Appointment data not found", 404);
  }

  return appointment;
}
