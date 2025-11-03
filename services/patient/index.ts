import getPatientAppointments from "./getPatientAppointments.service";
import getPatientById from "./getPatientById.service";
import getPatientDashboardStatistics from "./getPatientDashboardStatistic.service";
import getPatientInfomation from "./getPatientInformation.service";
import getPatients from "./getPatients.service";
import upsertPatient from "./upsertPatient.service";

const patientService = {
  upsertPatient,
  getPatientAppointments,
  getPatientDashboardStatistics,
  getPatientById,
  getPatientInfomation,
  getPatients,
};

export default patientService;
