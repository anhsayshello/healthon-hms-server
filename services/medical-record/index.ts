import getMedicalRecordById from "./getMedicalRecordById.service";
import getMedicalRecords from "./getMedicalRecords.service";
import getTodayMedicalRecords from "./getTodayMedicalRecords.service";

const medicalRecordService = {
  getMedicalRecords,
  getTodayMedicalRecords,
  getMedicalRecordById,
};

export default medicalRecordService;
