import prisma from "../../config/db";

export default async function getMedicalRecordById(id: number) {
  const medicalRecord = await prisma.medicalRecord.findUniqueOrThrow({
    where: { id },
    include: {
      patient: true,
      appointment: {
        select: {
          reason: true,
        },
      },
      vital_signs: true,
      diagnosis: true,
      lab_test: true,
      prescriptions: true,
    },
  });

  return medicalRecord;
}
