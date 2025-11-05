import prisma from "../../config/db";
import AppError from "../../utils/app-error";
import getRole from "../../utils/get-role";
import getToday from "../../utils/utils";
import appointmentService from "../appointment";

export default async function getPatientDashboardStatistics(uid: string) {
  const { isPatient } = await getRole(uid);
  if (!isPatient) {
    throw new AppError("You are not authorized to access this resource", 403);
  }

  const today = getToday();
  const [patient, appointments, availableDoctors, totalRecords] =
    await Promise.all([
      prisma.patient.findUnique({
        where: { uid },
        select: {
          uid: true,
          first_name: true,
          last_name: true,
          gender: true,
          photo_url: true,
        },
      }),
      prisma.appointment.findMany({
        where: { patient_id: uid },
        include: {
          doctor: {
            select: {
              uid: true,
              first_name: true,
              last_name: true,
              photo_url: true,
              specialization: true,
            },
          },
          patient: {
            select: {
              uid: true,
              first_name: true,
              last_name: true,
              gender: true,
              photo_url: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.doctor.findMany({
        select: {
          uid: true,
          first_name: true,
          last_name: true,
          photo_url: true,
          specialization: true,
          working_days: true,
        },
        where: {
          working_days: {
            some: {
              day: today,
            },
          },
        },
        take: 5,
      }),
      prisma.appointment.count({ where: { patient_id: uid } }),
    ]);

  const { appointmentCounts, monthlyData } =
    await appointmentService.processAppointments(appointments);

  const last5Records = appointments.slice(0, 5);
  const totalAppointments = appointments.length;

  return {
    data: patient,
    appointmentCounts,
    last5Records,
    totalAppointments,
    totalRecords,
    availableDoctors,
    monthlyData,
  };
}
