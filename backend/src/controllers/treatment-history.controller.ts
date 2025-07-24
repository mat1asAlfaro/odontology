import { Request, Response } from 'express';
import { z } from 'zod';
//import { ResultSetHeader } from 'mysql2';
import { logger, logWithFile } from "../services/logger";
const log = logWithFile(logger, __filename);

import { TreatmentHistoriesModel } from '../models';
//import { TreatmentHistory } from '../types';

export const getAllTreatmentHistories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await TreatmentHistoriesModel.getAllTreatmentHistories();
    res.json(result);
  } catch (error) {
    log.error("Error getting treatment histories: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getTreatmentHistoryByMedicalHistoryId = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await TreatmentHistoriesModel.getTreatmentHistoryByMedicalHistoryId(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Treatment history by medical history not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    log.error("Error getting medical history by medical history: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getTreatmentHistoryByTreatmentId = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await TreatmentHistoriesModel.getTreatmentHistoryByTreatmentId(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Treatment history by treatment not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    log.error("Error getting treatment history by treatment: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Esquema para un tratamiento individual
const TreatmentSchema = z.object({
  treatmentId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

// Esquema para la lista de tratamientos
const TreatmentsListSchema = z.object({
  treatments: z.array(TreatmentSchema).nonempty('At least one treatment is required'),
});

export const addTreatmentsToHistory = async (req: Request, res: Response): Promise<void> => {
  const historyId = parseInt(req.params.id, 10);

  if (isNaN(historyId)) {
    res.status(400).json({ message: 'Invalid medical history id' });
    return;
  }

  const parseResult = TreatmentsListSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ message: 'Datos inválidos', errors: parseResult.error });
    return;
  }

  const { treatments } = parseResult.data;

  try {
    const result = await TreatmentHistoriesModel.addTreatmentsToHistory(historyId, treatments);

    res.status(201).json({ message: 'Treatments added successfully', result });
  } catch (error) {
    log.error("Error adding treatments to history: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}