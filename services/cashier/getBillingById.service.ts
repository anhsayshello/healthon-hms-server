import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getBillingById(id: number) {
  const billing = await prisma.payment.findUnique({
    where: { id },
    include: {
      lab_bills: {
        include: { service: true },
      },
      prescription_bills: {
        include: {
          prescription: {
            include: { medication: true },
          },
        },
      },
      appointment: {
        include: {
          patient: true,
        },
      },
      cashier: true,
    },
  });

  if (!billing) {
    throw new AppError("Billing not found", 404);
  }

  return billing;
}
