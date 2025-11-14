import prisma from "../../config/db";

export default async function getReceiptById(id: number) {
  const receipt = await prisma.payment.findUniqueOrThrow({
    where: { id },
    include: {
      patient: {
        select: {
          first_name: true,
          last_name: true,
          phone: true,
        },
      },
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
    },
  });

  return receipt;
}
