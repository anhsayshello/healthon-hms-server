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

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { medical: { select: { id: true } } },
  });
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  const hasMedicalRecord = appointment.medical.length > 0;

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError("This appointment has already been completed", 400);
  } else if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError("This appointment has already been cancelled", 400);
  }

  if (status === AppointmentStatus.CANCELLED && hasMedicalRecord) {
    throw new AppError(
      "This appointment cannot be cancelled because medical examination has already started.",
      400
    );
  }

  if (appointment.status === status) {
    throw new AppError(`Appointment is already ${status.toLowerCase()}`, 400);
  }

  const updateData = {
    status,
    ...(reason !== undefined && { reason }),
    ...(note !== undefined && { note }),
  };

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
  } else if (isDoctor) {
    if (appointment.doctor_id !== uid) {
      throw new AppError(
        "You are not authorized to update this appointment.",
        403
      );
    }
  } else if (!isAdmin && !isNurse) {
    throw new AppError("You are not authorized to update appointments.", 403);
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: updateData,
  });

  return updatedAppointment;
}
