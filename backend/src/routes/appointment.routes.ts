import { Router } from 'express';
import { apiKeyAuth } from '../middlewares';
import { appointmentController } from '../controllers';

const router = Router();

router.use(apiKeyAuth);
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.patch('/status/:id', appointmentController.updateAppointmentStatus);
router.patch('/date/:id', appointmentController.updateAppointmentDate);
router.patch('/time/:id', appointmentController.updateAppointmentTime);

router.get('/patients/:patientId', appointmentController.getAppointmentsByPatientId);
router.get('/dentists/:dentistId', appointmentController.getAppointmentsByDentistId);

export default router;
