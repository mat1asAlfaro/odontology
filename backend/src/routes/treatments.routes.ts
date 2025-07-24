import { Router } from 'express';
import { apiKeyAuth } from '../middlewares'
import { treatmentController } from '../controllers';

const router = Router();

router.use(apiKeyAuth);
router.get("/", treatmentController.getAllTreatments);
router.get("/:id", treatmentController.getTreatmentById);
router.post("/", treatmentController.createTreatment);
router.put("/:id", treatmentController.updateTreatment);
router.delete("/:id", treatmentController.deleteTreatment);

export default router;