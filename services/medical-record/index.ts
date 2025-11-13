import createDiagnosis from "./diagnosis/createDiagnosis.service";
import getDiagnosisById from "./diagnosis/getDiagnosisById.service";
import getMedicalRecordById from "./getMedicalRecordById.service";
import getMedicalRecords from "./getMedicalRecords.service";
import getTodayMedicalRecords from "./getTodayMedicalRecords.service";
import createPrescription from "./prescription/createPrescription.service";
import getPrescriptionById from "./prescription/getPrescriptionById.service";
import updateDiagnosis from "./diagnosis/updateDiagnosis.service";
import updatePrescription from "./prescription/updatePrescription.service";
import deletePrescription from "./prescription/deletePrescription.service";
import deleteDiagnosis from "./diagnosis/deleteDiagnosis.service";

const medicalRecordService = {
  getMedicalRecords,
  getTodayMedicalRecords,
  getMedicalRecordById,
  // diagnosis,
  createDiagnosis,
  deleteDiagnosis,
  getDiagnosisById,
  updateDiagnosis,
  // prescription
  createPrescription,
  deletePrescription,
  getPrescriptionById,
  updatePrescription,
};

export default medicalRecordService;
