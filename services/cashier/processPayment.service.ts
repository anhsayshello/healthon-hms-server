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
          prescription: {
            select: {
              medication_id: true,
            },
          },
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
  const total_amount = payment.subtotal - discount;
  const change_amount = amount_paid - total_amount;

  if (change_amount < 0) {
    throw new AppError(
      `Insufficient amount. Required: ${total_amount}, Received: ${amount_paid}`,
      400
    );
  }

  await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.PAID,
        payment_method: payment_method,
        payment_date: new Date(),
        amount_paid: amount_paid,
        discount: discount,
        total_amount,
        change_amount,
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
        notes: `Payment via ${payment_method} - Paid: ${amount_paid} - Change: ${change_amount}`,
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

    return updatedPayment;
  });
}
