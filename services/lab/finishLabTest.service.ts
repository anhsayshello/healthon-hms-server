import { LabTestStatus } from "@prisma/client";
import prisma from "../../config/db";

export default async function finishLabTest(
  id: number,
  technician_id: string,
  result: string
) {
  const data = await prisma.labTest.update({
    where: { id },
    data: { technician_id, result, status: LabTestStatus.COMPLETED },
  });

  return data;
}
