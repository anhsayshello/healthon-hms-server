import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function createLabService(
  service_name: string,
  description: string,
  price: number
) {
  const existingService = await prisma.service.findUnique({
    where: { service_name },
  });

  if (existingService) {
    throw new AppError(
      `service "${existingService.service_name}" already exists with ID #${existingService.id}. ` +
        `Please update the existing service or use a different name.`,
      409
    );
  }

  const newService = await prisma.service.create({
    data: {
      service_name,
      description,
      price,
    },
  });

  return newService;
}
