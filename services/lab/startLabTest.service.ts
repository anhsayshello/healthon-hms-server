import { LabTestStatus } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function startLabTest(id: number, technician_id: string) {
  const labTest = await prisma.labTest.findUnique({
    where: { id },
  });

  if (!labTest) {
    throw new AppError("Lab test not found", 404);
  }

  if (labTest.status !== LabTestStatus.PENDING) {
    throw new AppError(
      `Cannot start lab test with status ${labTest.status}`,
      400
    );
  }

  const data = await prisma.labTest.update({
    where: { id },
    data: {
      technician_id,
      status: LabTestStatus.IN_PROGRESS,
    },
  });

  return data;
}
