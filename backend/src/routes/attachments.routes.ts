import { Router } from 'express';
import { apiKeyAuth } from '../middlewares';
import { attachmentController } from '../controllers';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(apiKeyAuth);
router.get('/:id', attachmentController.getAttachmentById);
router.get('/history/:historyId', attachmentController.getHistoryAttachments);
router.post('/', upload.single('file'), attachmentController.createAttachment);
router.delete('/:id', attachmentController.deleteAttachmant)

export default router;