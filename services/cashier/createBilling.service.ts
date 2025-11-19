import { LabTestStatus } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function createBilling(
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
      throw new AppError("Billing not found", 404);
    }

    let subtotal = 0;
    const labBillsData = [];
    const prescriptionBillsData = [];

    for (const record of appointment.medical_records) {
      for (const test of record.lab_tests) {
        subtotal += test.service.price;
        labBillsData.push({
          service_id: test.service_id,
          service_date: test.test_date,
          unit_cost: test.service.price,
          total_cost: test.service.price,
        });
      }

      for (const prescription of record.prescriptions) {
        const prescriptionTotal =
          prescription.quantity * prescription.medication.unit_price;
        subtotal += prescriptionTotal;

        prescriptionBillsData.push({
          prescription_id: prescription.id,
          quantity: prescription.quantity,
          unit_cost: prescription.medication.unit_price,
          total_cost: prescriptionTotal,
        });
      }
    }

    if (subtotal === 0) {
      throw new AppError("No billable items found", 400);
    }

    const payment = await tx.payment.create({
      data: {
        patient_id: appointment.patient_id,
        appointment_id: appointment_id,
        bill_date: new Date(),
        subtotal,
        discount: 0,
        total_amount: subtotal,
        amount_paid: 0,
        cashier_id,
      },
    });

    if (labBillsData.length > 0) {
      await tx.labBill.createMany({
        data: labBillsData.map((bill) => ({
          ...bill,
          payment_id: payment.id,
        })),
      });
    }

    if (prescriptionBillsData.length > 0) {
      await tx.prescriptionBill.createMany({
        data: prescriptionBillsData.map((bill) => ({
          ...bill,
          payment_id: payment.id,
        })),
      });
    }

    return payment;
  });
}
