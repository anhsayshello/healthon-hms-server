import completeConsultation from "./completeConsultation.service";
import getDoctorById from "./getDoctorById.service";
import getDoctorDashboardStatistics from "./getDoctorDashboardStatistice.service";
import getDoctors from "./getDoctors.service";
import startConsultation from "./startConsultation.service";

const doctorService = {
  getDoctorDashboardStatistics,
  getDoctors,
  getDoctorById,
  startConsultation,
  completeConsultation,
};

export default doctorService;
