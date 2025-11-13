import prisma from "../../../config/db";

export default async function deleteDiagnosis(id: number) {
  await prisma.diagnosis.delete({ where: { id } });
  return { message: "Deleted successfully." };
}
