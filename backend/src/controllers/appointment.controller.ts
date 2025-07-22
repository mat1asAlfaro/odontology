import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { logger, logWithFile } from "../services/logger";
const log = logWithFile(logger, __filename);

import { UserModel, AppointmentModel } from "../models";

import { Appointment } from '../types';

export const getAllAppointments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await AppointmentModel.getAllAppointments();
    res.json(result);
  } catch (error) {
    log.error("Error getting appointments: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await AppointmentModel.getAppointmentById(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(result[0]);
  } catch (error) {
    log.error("Error getting appointment by id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  const { patientId, dentistId, date, time, status, comment } = req.body;

  try {
    const appointmentData: Appointment = {
      patientId,
      dentistId,
      date,
      time,
      status,
      comment,
    };

    const appointmentResult: ResultSetHeader = await AppointmentModel.createAppointment(
      appointmentData
    );
    const appointmentId = appointmentResult.insertId;

    res.status(201).json({
      message: `Appointment #${ appointmentId } created successfully`,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Appointment could not be created" });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { patientId, dentistId, date, time, comment } = req.body;

  const patientIdExists = await UserModel.getUserByPatientId(patientId);
  if (patientIdExists.length === 0) {
    res.status(400).json({
      message: "Non-existent patient id",
    });
    return;
  }

  const dentistIdExists = await UserModel.getUserByDentistId(dentistId);
  if (dentistIdExists.length === 0) {
    res.status(400).json({
      message: "Non-existent dentist id",
    });
    return;
  }

  try {
    const appointmentData: Appointment = { patientId, dentistId, date, time, comment };

    await AppointmentModel.updateAppointment(id, appointmentData);

    res.json({ message: `Appointment updated successfully` });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating appointment"
    });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const appointmentIdExists: Appointment[] = await AppointmentModel.getAppointmentById(id);
  if (!appointmentIdExists) {
    res.status(400).json({
      message: "Appointment not found",
    });
    return;
  }

  try {
    await AppointmentModel.updateAppointmentStatus(id, status);

    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating appointment status"
    });
  }
};

export const updateAppointmentDate = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { date } = req.body;

  const appointmentIdExists: Appointment[] = await AppointmentModel.getAppointmentById(id);
  if (!appointmentIdExists) {
    res.status(400).json({
      message: "Appointment not found",
    });
    return;
  }

  try {
    await AppointmentModel.updateAppointmentDate(id, date);

    res.json({ message: 'Appointment date updated successfully' });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating appointment date"
    });
  }
}

export const updateAppointmentTime = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { time } = req.body;

  const appointmentIdExists: Appointment[] = await AppointmentModel.getAppointmentById(id);
  if (!appointmentIdExists) {
    res.status(400).json({
      message: "Appointment not found",
    });
    return;
  }

  try {
    await AppointmentModel.updateAppointmentTime(id, time);

    res.json({ message: 'Appointment time updated successfully' });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating appointment time"
    });
  }
}
