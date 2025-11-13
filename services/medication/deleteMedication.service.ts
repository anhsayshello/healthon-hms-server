import prisma from "../../config/db";

export default async function deleteMedication(id: number) {
  await prisma.medication.delete({ where: { id } });
  return { message: "Deleted successfully." };
}
