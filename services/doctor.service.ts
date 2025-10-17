import prisma from "../config/db";

const doctorService = {
  async getDoctors() {
    const data = await prisma.doctor.findMany();
    return {
      data,
    };
  },
};

export default doctorService;
