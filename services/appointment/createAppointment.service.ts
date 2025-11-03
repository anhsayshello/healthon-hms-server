import { AppointmentStatus } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function createAppointment(
  patient_id: string,
  doctor_id: string,
  appointment_date: string,
  time: string,
  type: string,
  note?: string
) {
  const targetDate = new Date(appointment_date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      patient_id,
      appointment_date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: { not: AppointmentStatus.CANCELLED },
    },
  });

  if (existingAppointment) {
    throw new AppError(
      `You already have an appointment on ${targetDate.toLocaleDateString()}.`
    );
  }

  const doctor = await prisma.doctor.findUnique({
    where: { uid: doctor_id },
    select: { first_name: true, last_name: true, working_days: true },
  });

  const dayName = new Date(appointment_date)
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  const isAvailable = doctor?.working_days.some((item) => {
    console.log(appointment_date);
    return item.day === dayName;
  });

  if (!isAvailable) {
    throw new AppError(
      `Please select a date within the doctor's working schedule.`
    );
  }

  const newAppointment = await prisma.appointment.create({
    data: {
      patient_id,
      doctor_id,
      appointment_date,
      time,
      status: AppointmentStatus.PENDING,
      type,
      note: note ?? null,
    },
  });

  return { data: newAppointment };
}
