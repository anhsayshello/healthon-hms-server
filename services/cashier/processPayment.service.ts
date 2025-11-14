import { AppointmentStatus, PaymentStatus, type Payment } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function processPayment(
  cashier_id: string,
  id: number,
  props: Pick<Payment, "payment_method" | "amount_paid" | "discount" | "notes">
) {
  const { payment_method, amount_paid, discount, notes } = props;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      prescription_bills: {
        include: {
          prescription: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }
  if (payment.status === PaymentStatus.PAID) {
    throw new AppError("This payment has already been completed", 409);
  }

  // Calculate amounts
  const finalAmount = payment.total_amount - discount;
  const changeAmount = amount_paid - finalAmount;

  if (changeAmount < 0) {
    throw new AppError("Insufficient amount received", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.PAID,
        payment_method: payment_method,
        payment_date: new Date(),
        amount_paid: amount_paid,
        discount: discount,
        change_amount: changeAmount,
        notes,
        cashier_id,
      },
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
            doctor: true,
          },
        },
        cashier: true,
      },
    });

    // Create payment history
    await tx.paymentHistory.create({
      data: {
        payment_id: id,
        previous_status: payment.status,
        new_status: PaymentStatus.PAID,
        changed_by: cashier_id as string,
        notes: `Payment ${payment_method} - Received: ${amount_paid} - Change: ${changeAmount}`,
      },
    });

    // Update appointment status
    await tx.appointment.update({
      where: { id: payment.appointment_id },
      data: { status: AppointmentStatus.COMPLETED },
    });

    // Update medication stock and mark prescriptions as dispensed
    for (const bill of payment.prescription_bills) {
      // Decrease stock
      await tx.medication.update({
        where: { id: bill.prescription.medication_id },
        data: {
          stock_quantity: {
            decrement: bill.quantity,
          },
        },
      });
    }
  });

  return result;
}
