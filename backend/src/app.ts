import express, { Application } from 'express';
import cors from 'cors';

import {
  seedRoutes,
  userRoutes,
  appointmentRoutes,
  medicalHistoryRoutes,
  treatmentHistoryRoutes,
  treatmentRoutes,
  attachmentRoutes
} from './routes';

const app: Application = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", seedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-histories", medicalHistoryRoutes);
app.use("/api/treatment-histories", treatmentHistoryRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/attachments", attachmentRoutes);

export default app;
