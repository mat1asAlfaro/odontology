import express, { Application } from 'express';
import cors from 'cors';

import { seedRoutes, userRoutes, appointmentRoutes, medicalHistoryRoutes } from './routes';


const app: Application = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", seedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-histories", medicalHistoryRoutes);

export default app;
