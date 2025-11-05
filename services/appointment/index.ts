import createAppointment from "./createAppointment.service";
import getAppointmentById from "./getAppointmentById.service";
import getAppointments from "./getAppointments.service";
import getDoctorAppointments from "./getDoctorAppointments.service";
import getPatientAppointments from "./getPatientAppointments.service";
import processAppointments from "./processAppointments.service";
import updateAppointmentById from "./updateAppointment.service";

const appointmentService = {
  createAppointment,
  processAppointments,
  updateAppointmentById,
  getAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  getAppointmentById,
};

export default appointmentService;
