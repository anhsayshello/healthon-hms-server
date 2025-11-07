import { LabTestStatus } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function cancelLabRequest(id: number, notes?: string) {
  const labRequest = await prisma.labTest.findUnique({
    where: { id, status: LabTestStatus.PENDING },
  });

  if (!labRequest) {
    throw new AppError("Lab request invalid", 400);
  }

  const data = await prisma.labTest.update({
    where: { id },
    data: {
      notes: notes ?? null,
      status: LabTestStatus.CANCELLED,
    },
  });

  return data;
}
