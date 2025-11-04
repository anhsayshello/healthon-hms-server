import createAppointment from "./createAppointment.service";
import getAppointmentById from "./getAppointmentById.service";
import getAppointments from "./getAppointments.service";
import processAppointments from "./processAppointments.service";
import updateAppointmentById from "./updateAppointment.service";

const appointmentService = {
  createAppointment,
  processAppointments,
  updateAppointmentById,
  getAppointments,
  getAppointmentById,
};

export default appointmentService;
