import prisma from "../../config/db";

export default async function createLabService(
  service_name: string,
  description: string,
  price: number
) {
  const service = await prisma.service.create({
    data: {
      service_name,
      description,
      price,
    },
  });

  return service;
}
