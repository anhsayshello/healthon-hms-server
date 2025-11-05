import getDoctorById from "./getDoctorById.service";
import getDoctorDashboardStatistics from "./getDoctorDashboardStatistice.service";
import getDoctors from "./getDoctors.service";

const doctorService = {
  getDoctorDashboardStatistics,
  getDoctors,
  getDoctorById,
};

export default doctorService;
