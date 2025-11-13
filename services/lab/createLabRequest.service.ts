import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function createLabRequest(
  service_id: number,
  medical_record_id: number
) {
  const labReq = await prisma.labTest.findUnique({
    where: {
      service_id_medical_record_id: {
        service_id,
        medical_record_id,
      },
    },
  });

  if (labReq) {
    throw new AppError("This service already added!");
  }

  const data = await prisma.labTest.create({
    data: {
      service_id,
      medical_record_id,
      test_date: new Date(),
    },
  });

  return data;
}
