import prisma from "../../config/db";

export default async function getReceiptById(id: number) {
  const receipt = await prisma.payment.findUniqueOrThrow({
    where: { id },
    include: {
      patient: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
        },
      },
      lab_bills: {
        select: {
          service: {
            select: {
              service_name: true,
            },
          },
          unit_cost: true,
          total_cost: true,
        },
      },
      prescription_bills: {
        select: {
          prescription: {
            select: {
              dosage: true,
              frequency: true,
              duration: true,
              medication: { select: { medication_name: true } },
            },
          },
          quantity: true,
          unit_cost: true,
          total_cost: true,
        },
      },
    },
  });
  console.log(receipt);

  return receipt;
}
