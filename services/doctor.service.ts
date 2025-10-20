import prisma from "../config/db";

const doctorService = {
  async getDoctors() {
    const data = await prisma.doctor.findMany({
      include: {
        working_days: true,
      },
    });
    return {
      data,
    };
  },
};

export default doctorService;
