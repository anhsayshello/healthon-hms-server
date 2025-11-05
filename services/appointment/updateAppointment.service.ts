import { AppointmentStatus } from "@prisma/client";
import getRole from "../../utils/get-role";
import AppError from "../../utils/app-error";
import prisma from "../../config/db";

export default async function updateAppointmentById(
  uid: string,
  id: number,
  status: AppointmentStatus,
  reason?: string,
  note?: string
) {
  const { role, isPatient, isDoctor, isNurse, isAdmin } = await getRole(uid);

  if (!role) {
    throw new AppError("User role not found", 403);
  }

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError("This appointment has already been completed");
  } else if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError("This appointment has already been cancelled");
  }

  if (appointment.status === status) {
    throw new AppError(`Appointment is already ${status.toLowerCase()}`, 400);
  }

  let updatedAppointment = null;

  if (isPatient) {
    if (appointment.patient_id !== uid) {
      throw new AppError(
        "You are not authorized to cancel this appointment.",
        403
      );
    }

    if (status !== AppointmentStatus.CANCELLED) {
      throw new AppError("You can only cancel your appointments.", 400);
    }

    updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        reason: reason ?? null,
        note: note ?? null,
      },
    });
  } else if (isDoctor) {
    if (appointment.doctor_id !== uid) {
      throw new AppError(
        "You are not authorized to update this appointment.",
        403
      );
    }

    updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        reason: reason ?? null,
        note: note ?? null,
      },
    });
  } else if (isAdmin || isNurse) {
    updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        reason: reason ?? null,
        note: note ?? null,
      },
    });
  } else {
    throw new AppError("You are not authorized to update appointments.", 403);
  }

  return updatedAppointment;
}
