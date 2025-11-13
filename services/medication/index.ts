import createMedication from "./createMedication.service";
import deleteMedication from "./deleteMedication.service";
import getMedications from "./getMedications.service";
import updateMedication from "./updateMedication.service";

const medicationService = {
  createMedication,
  deleteMedication,
  getMedications,
  updateMedication,
};

export default medicationService;
