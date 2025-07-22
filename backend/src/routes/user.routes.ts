import { Router } from 'express';
import { apiKeyAuth } from '../middlewares'
import { userController } from '../controllers';

const router = Router();

router.use(apiKeyAuth);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/status/:id", userController.updateUserStatus);
router.patch("/password/:id", userController.updateUserPassword);
router.delete("/:id", userController.deleteUser);

export default router;
