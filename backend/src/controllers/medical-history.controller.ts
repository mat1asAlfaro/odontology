import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { logger, logWithFile } from "../services/logger";
const log = logWithFile(logger, __filename);

import { UserModel, MedicalHistoriesModel } from '../models';
import { MedicalHistory } from '../types';

export const getAllMedicalHistories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await MedicalHistoriesModel.getAllMedicalHistories();
    res.json(result);
  } catch (error) {
    log.error("Error getting medical histories: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

export const getMedicalHistoryById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await MedicalHistoriesModel.getMedicalHistoryById(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Medical history not found" });
      return;
    }

    res.json(result[0]);
  } catch (error) {
    log.error("Error getting medical history by id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const createMedicalHistory = async (req: Request, res: Response): Promise<void> => {
  const { patientId, dentistId, date, diagnostic, treatmentPerformed, observations } = req.body;

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
    const medicalHistoryData: MedicalHistory = {
      patientId,
      dentistId,
      date,
      diagnostic,
      treatmentPerformed,
      observations,
    };

    const medicalHistoryResult: ResultSetHeader = await MedicalHistoriesModel.createMedicalHistory(
      medicalHistoryData
    );
    const medicalHistoryId = medicalHistoryResult.insertId;

    res.status(201).json({
      message: `Medical History #${ medicalHistoryId } created successfully`,
    });
  } catch (error) {
    console.error("Error creating medical history:", error);
    res.status(500).json({ error: "Medical History could not be created" });
  }
}

export const updateMedicalHistory = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { patientId, dentistId, date, diagnostic, treatmentPerformed, observations } = req.body;

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
    const medicalHistoryData: MedicalHistory = { patientId, dentistId, date, diagnostic, treatmentPerformed, observations };

    await MedicalHistoriesModel.updateMedicalHistory(id, medicalHistoryData);

    res.json({ message: `Appointment updated successfully` });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating appointment"
    });
  }
}

export const updateMedicalHistoryDiagnostic = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { diagnostic } = req.body;

  const medicalHistoryIdExists: MedicalHistory[] = await MedicalHistoriesModel.getMedicalHistoryById(id);
  if (medicalHistoryIdExists.length === 0) {
    res.status(400).json({
      message: "Medical History not found",
    });
    return;
  }

  try {
    await MedicalHistoriesModel.updateMedicalHistoryDiagnostic(id, diagnostic);

    res.json({ message: 'Medical History diagnostic updated successfully' });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating medical history diagnostic"
    });
  }
}

export const updateMedicalHistoryTreatmentPerformed = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { treatmentPerformed } = req.body;

  const medicalHistoryIdExists: MedicalHistory[] = await MedicalHistoriesModel.getMedicalHistoryById(id);
  if (medicalHistoryIdExists.length === 0) {
    res.status(400).json({
      message: "Medical History not found",
    });
    return;
  }

  try {
    await MedicalHistoriesModel.updateMedicalHistoryTreatmentPerformed(id, treatmentPerformed);

    res.json({ message: 'Medical History treatment performed updated successfully' });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating medical history treatment performed"
    });
  }
}

export const updateMedicalHistoryObservations = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { observations } = req.body;

  const medicalHistoryIdExists: MedicalHistory[] = await MedicalHistoriesModel.getMedicalHistoryById(id);
  if (medicalHistoryIdExists.length === 0) {
    res.status(400).json({
      message: "Medical History not found",
    });
    return;
  }

  try {
    await MedicalHistoriesModel.updateMedicalHistoryObservations(id, observations);

    res.json({ message: 'Medical History observations updated successfully' });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating medical history observations"
    });
  }
}

export const getMedicalHistoriesByPatientId = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.patientId, 10);

  const patientIdExists = await UserModel.getUserByPatientId(id);
  if (patientIdExists.length === 0) {
    res.status(400).json({
      message: "Non-existent patient id",
    });
    return;
  }

  try {
    const result = await MedicalHistoriesModel.getMedicalHistoriesByPatientId(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Patient Medical History not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    log.error("Error getting medical history by patient id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getMedicalHistoriesByDentistId = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.dentistId, 10);

  const dentistIdExists = await UserModel.getUserByDentistId(id);
  if (dentistIdExists.length === 0) {
    res.status(400).json({
      message: "Non-existent dentist id",
    });
    return;
  }

  try {
    const result = await MedicalHistoriesModel.getMedicalHistoriesByDentistId(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Dentist Medical History not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    log.error("Error getting medical history by dentist id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}