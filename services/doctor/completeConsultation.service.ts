import { AppointmentStatus, LabTestStatus } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function completeConsultation(
  uid: string,
  appointment_id: number
) {
  const appointment = await prisma.appointment.findFirstOrThrow({
    where: { id: appointment_id, status: AppointmentStatus.IN_CONSULTATION },
    select: {
      doctor_id: true,
      medical_records: {
        select: {
          prescriptions: { select: { id: true } },
          lab_tests: {
            select: { id: true, status: true },
          },
        },
      },
    },
  });

  if (appointment.doctor_id !== uid)
    throw new AppError(
      `Doctor UID: ${uid} is not authorized to access appointment ID: ${appointment_id}`,
      403
    );

  const hasPendingLabTest = appointment.medical_records.some((record) =>
    record.lab_tests.some((lt) => lt.status === LabTestStatus.PENDING)
  );

  if (hasPendingLabTest) {
    throw new AppError(
      "Cannot complete consultation — pending lab test detected.",
      400
    );
  }

  const hasPrescription = appointment.medical_records.some(
    (record) => record.prescriptions.length > 0
  );

  const hasCompletedLabTest = appointment.medical_records.some((record) =>
    record.lab_tests.some((lt) => lt.status === LabTestStatus.COMPLETED)
  );

  const nextStatus =
    hasPrescription || hasCompletedLabTest
      ? AppointmentStatus.CONSULTATION_COMPLETED
      : AppointmentStatus.COMPLETED;

  await prisma.appointment.update({
    where: { id: appointment_id },
    data: {
      status: nextStatus,
    },
  });

  return { message: "Completed consultation." };
}
