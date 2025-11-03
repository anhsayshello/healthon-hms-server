import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getStaffById(uid: string) {
  const data = await prisma.staff.findUnique({ where: { uid } });
  if (!data) {
    throw new AppError("Staff data not found", 404);
  }

  return { data };
}
