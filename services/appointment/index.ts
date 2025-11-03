import createAppointment from "./createAppointment.service";
import getAppointmentById from "./getAppointmentById.service";
import getTodayAppointments from "./getTodayAppointments.service";
import processAppointments from "./processAppointments.service";
import updateAppointmentById from "./updateAppointment.service";

const appointmentService = {
  createAppointment,
  processAppointments,
  updateAppointmentById,
  getTodayAppointments,
  getAppointmentById,
};

export default appointmentService;
