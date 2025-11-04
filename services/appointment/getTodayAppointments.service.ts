import prisma from "../../config/db";
import getToday from "../../utils/utils";

export default async function getTodayAppointments() {
  const today = getToday();

  const todayAppointment = await prisma.appointment.findMany({
    where: { appointment_date: { equals: today } },
  });

  return todayAppointment;
}
