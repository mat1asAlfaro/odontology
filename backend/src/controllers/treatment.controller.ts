import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { logger, logWithFile } from "../services/logger";
const log = logWithFile(logger, __filename);

import { TreatmentModel } from '../models';
//import { TreatmentHistory } from '../types';

export const getAllTreatments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await TreatmentModel.getAllTreatments();
    res.json(result);
  } catch (error) {
    log.error("Error getting treatments: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getTreatmentById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await TreatmentModel.getTreatmentById(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Treatment not found" });
      return;
    }

    res.json(result[0]);
  } catch (error) {
    log.error("Error getting treatment by id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const createTreatment = async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, estimatedDuration } = req.body;

  try {
    const treatmentData = { name, description, price, estimatedDuration };

    const treatmentResult: ResultSetHeader = await TreatmentModel.createTreatment(treatmentData);
    const treatmentId = treatmentResult.insertId;

    res.status(201).json({
      message: `Treatment #${ treatmentId } created successfully`,
    });
  } catch (error) {
    log.error("Error creating treatment:", error);
    res.status(500).json({ error: "Treatment could not be created" });
  }
}

export const updateTreatment = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { name, description, price, estimatedDuration } = req.body;

  try {
    const treatmentData = { name, description, price, estimatedDuration };

    const treatmentResult: ResultSetHeader = await TreatmentModel.updateTreatment(id, treatmentData);
    const treatmentId = treatmentResult.insertId;

    res.status(201).json({
      message: `Treatment #${ treatmentId } updated successfully`,
    });
  } catch (error) {
    log.error("Error updating treatment:", error);
    res.status(500).json({ error: "Treatment could not be updated" });
  }
}

export const deleteTreatment = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    const treatmentResult: ResultSetHeader = await TreatmentModel.deleteTreatment(id);
    const treatmentId = treatmentResult.insertId;

    res.status(201).json({
      message: `Treatment #${ treatmentId } deleted successfully`,
    });
  } catch (error) {
    log.error("Error deleting treatment:", error);
    res.status(500).json({ error: "Treatment could not be deleted" });
  }
}