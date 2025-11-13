import prisma from "../../../config/db";

export default async function getDiagnosisById(id: number) {
  const diagnosis = await prisma.diagnosis.findUnique({
    where: { id },
  });

  return diagnosis;
}
