import prisma from "../../config/db";

export default async function getMedicalRecordById(id: number) {
  const medicalRecord = await prisma.medicalRecord.findUniqueOrThrow({
    where: { id },
    include: {
      patient: true,
      appointment: {
        select: {
          status: true,
          reason: true,
        },
      },
      vital_signs: true,
      diagnoses: true,
      lab_tests: {
        include: {
          service: true,
          technician: true,
        },
      },
      prescriptions: {
        include: { medication: { select: { medication_name: true } } },
      },
    },
  });

  return medicalRecord;
}
