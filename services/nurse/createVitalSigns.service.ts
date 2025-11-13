import { AppointmentStatus, type VitalSigns } from "@prisma/client";
import prisma from "../../config/db";

export default async function createVitalSigns(
  appointment_id: number,
  props: Omit<
    VitalSigns,
    "id" | "patient_id" | "medical_record_id" | "created_at" | "updated_at"
  >
) {
  return await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUniqueOrThrow({
      where: { id: appointment_id, status: AppointmentStatus.SCHEDULED },
      select: {
        id: true,
        patient_id: true,
        doctor_id: true,
      },
    });

    let medicalRecord = await tx.medicalRecord.findFirst({
      where: {
        appointment_id,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
      },
    });

    if (!medicalRecord) {
      medicalRecord = await tx.medicalRecord.create({
        data: {
          appointment_id,
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
        },
      });
    }

    const newVitalSigns = await tx.vitalSigns.create({
      data: {
        medical_record_id: medicalRecord.id,
        ...props,
      },
    });

    return newVitalSigns;
  });
}
