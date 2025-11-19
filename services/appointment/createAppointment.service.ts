import { AppointmentStatus, type Appointment } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";
import { endOfDay, parse, parseISO, startOfDay } from "date-fns";

export default async function createAppointment(
  patient_id: string,
  props: Pick<
    Appointment,
    "doctor_id" | "appointment_date" | "time" | "type" | "reason"
  >
) {
  const { doctor_id, appointment_date, time, type, reason } = props;

  const utcDateString = `${appointment_date}T00:00:00.000Z`;
  const targetDateISO = new Date(utcDateString);

  const startOfDayUTC = new Date(`${appointment_date}T00:00:00.000Z`);
  const endOfDayUTC = new Date(`${appointment_date}T23:59:59.999Z`);

  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      patient_id,
      appointment_date: {
        gte: startOfDayUTC,
        lte: endOfDayUTC,
      },
      status: { not: AppointmentStatus.CANCELLED },
    },
  });

  if (existingAppointment) {
    const displayDate = targetDateISO.toLocaleDateString("vi-VN", {
      timeZone: "UTC",
    });
    throw new AppError(`You already have an appointment on ${displayDate}.`);
  }

  const doctor = await prisma.doctor.findUnique({
    where: { uid: doctor_id },
    select: { first_name: true, last_name: true, working_days: true },
  });

  const dayName = targetDateISO
    .toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
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
      appointment_date: targetDateISO,
      time,
      status: AppointmentStatus.PENDING,
      type,
      reason,
    },
  });

  return newAppointment;
}
