import getDoctorAppointments from "./getDoctorAppointments.service";
import getDoctorById from "./getDoctorById.service";
import getDoctorDashboardStatistics from "./getDoctorDashboardStatistice.service";
import getDoctors from "./getDoctors.service";

const doctorService = {
  getDoctorDashboardStatistics,
  getDoctorAppointments,
  getDoctors,
  getDoctorById,
};

export default doctorService;
