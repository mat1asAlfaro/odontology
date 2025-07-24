import { Router } from 'express';
import { apiKeyAuth } from '../middlewares'
import { treatmentHistoryController } from '../controllers';

const router = Router();

router.use(apiKeyAuth);
router.get("/", treatmentHistoryController.getAllTreatmentHistories);
router.get("/medical-history/:id", treatmentHistoryController.getTreatmentHistoryByMedicalHistoryId);
router.get("/treatment/:id", treatmentHistoryController.getTreatmentHistoryByTreatmentId);
router.post("/medical-histories/:id/treatments", treatmentHistoryController.addTreatmentsToHistory)

export default router;