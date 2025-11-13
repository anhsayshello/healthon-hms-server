import prisma from "../../../config/db";

export default async function getPrescriptionById(id: number) {
  const prescription = await prisma.prescription.findUnique({
    where: { id },
  });

  return prescription;
}
