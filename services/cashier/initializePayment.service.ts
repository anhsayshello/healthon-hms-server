import { LabTestStatus } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function initializePayment(
  cashier_id: string,
  appointment_id: number
) {
  return await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointment_id },
      include: {
        medical_records: {
          include: {
            lab_tests: {
              where: { status: LabTestStatus.COMPLETED },
              include: { service: true },
            },
            prescriptions: {
              include: { medication: true },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new AppError("Payment not found", 404);
    }

    const payment = await tx.payment.create({
      data: {
        patient_id: appointment.patient_id,
        appointment_id: appointment_id,
        bill_date: new Date(),
        total_amount: 0,
        amount_paid: 0,
        cashier_id,
      },
    });

    let totalAmount = 0;

    for (const record of appointment.medical_records) {
      for (const test of record.lab_tests) {
        await tx.labBill.create({
          data: {
            payment_id: payment.id,
            service_id: test.service_id,
            service_date: test.test_date,
            unit_cost: test.service.price,
            total_cost: test.service.price,
          },
        });
        totalAmount += test.service.price;
      }

      for (const prescription of record.prescriptions) {
        const prescriptionTotal =
          prescription.quantity * prescription.medication.unit_price;

        await tx.prescriptionBill.create({
          data: {
            payment_id: payment.id,
            prescription_id: prescription.id,
            quantity: prescription.quantity,
            unit_cost: prescription.medication.unit_price,
            total_cost: prescriptionTotal,
          },
        });
        totalAmount += prescriptionTotal;
      }
    }

    await tx.payment.update({
      where: { id: payment.id },
      data: { total_amount: totalAmount },
    });

    return payment;
  });
}
