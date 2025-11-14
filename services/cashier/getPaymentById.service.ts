import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function getPaymentById(id: number) {
  const payment = await prisma.payment.findUnique({
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

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  return payment;
}
