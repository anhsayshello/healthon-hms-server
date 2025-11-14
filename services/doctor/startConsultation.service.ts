import { AppointmentStatus } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function startConsultation(
  uid: string,
  appointment_id: number
) {
  const appointment = await prisma.appointment.findFirstOrThrow({
    where: { id: appointment_id, status: AppointmentStatus.SCHEDULED },
    select: { doctor_id: true, status: true },
  });

  if (appointment.doctor_id !== uid)
    throw new AppError(
      `Doctor UID: ${uid} is not authorized to access appointment ID: ${appointment_id}`,
      403
    );

  await prisma.appointment.update({
    where: { id: appointment_id },
    data: {
      status: AppointmentStatus.IN_CONSULTATION,
    },
  });

  return { message: "Started consultation" };
}
