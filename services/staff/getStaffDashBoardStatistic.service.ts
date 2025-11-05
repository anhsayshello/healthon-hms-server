import prisma from "../../config/db";
import getToday from "../../utils/utils";
import appointmentService from "../appointment";

export default async function getStaffDashBoardStatistic() {
  const today = getToday();
  const [
    totalPatients,
    totalDoctors,
    appointments,
    availableDoctors,
    totalRecords,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            gender: true,
            date_of_birth: true,
            photo_url: true,
          },
        },
        doctor: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            specialization: true,
            photo_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.doctor.findMany({
      where: { working_days: { some: { day: today } } },
      select: {
        uid: true,
        first_name: true,
        last_name: true,
        photo_url: true,
        specialization: true,
        working_days: true,
      },
      take: 5,
    }),
    prisma.appointment.count(),
  ]);

  const { appointmentCounts, monthlyData } =
    await appointmentService.processAppointments(appointments);

  const last5Records = appointments.slice(0, 5);
  const totalAppointments = appointments.length;

  return {
    totalPatients,
    totalDoctors,
    appointmentCounts,
    last5Records,
    availableDoctors,
    totalRecords,
    totalAppointments,
    monthlyData,
  };
}
