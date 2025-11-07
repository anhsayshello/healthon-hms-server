import prisma from "../../config/db";

export default async function createLabRequest(
  service_id: number,
  medical_id: number
) {
  const data = await prisma.labTest.create({
    data: {
      service_id,
      medical_id,
      test_date: new Date(),
    },
  });

  return data;
}
