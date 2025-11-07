import prisma from "../../config/db";

export default async function getLabTestById(id: number) {
  const data = prisma.labTest.findUnique({
    where: { id },
    include: {
      service: true,
      technician: true,
      medical_record: {
        include: {
          patient: true,
          appointment: { include: { doctor: true } },
        },
      },
    },
  });
  return data;
}
