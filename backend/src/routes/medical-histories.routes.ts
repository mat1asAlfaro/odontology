import { Router } from 'express';
import { apiKeyAuth } from '../middlewares'
import { medicalHistoryController } from '../controllers';

const router = Router();

router.use(apiKeyAuth);
router.get("/", medicalHistoryController.getAllMedicalHistories);
router.get("/:id", medicalHistoryController.getMedicalHistoryById);
router.post("/", medicalHistoryController.createMedicalHistory);
router.put("/:id", medicalHistoryController.updateMedicalHistory);
router.patch("/diagnostic/:id", medicalHistoryController.updateMedicalHistoryDiagnostic);
router.patch("/treatment-performed/:id", medicalHistoryController.updateMedicalHistoryTreatmentPerformed);
router.patch("/observations/:id", medicalHistoryController.updateMedicalHistoryObservations);
router.get('/patients/:patientId', medicalHistoryController.getMedicalHistoriesByPatientId);
router.get('/dentists/:dentistId', medicalHistoryController.getMedicalHistoriesByDentistId);

export default router;