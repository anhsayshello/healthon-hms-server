import prisma from "../../../config/db";

export default async function deletePrescription(id: number) {
  await prisma.prescription.delete({ where: { id } });
  return { message: "Deleted successfully." };
}
