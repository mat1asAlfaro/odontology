import db from '../config/db';
//import { TreatmentHistory } from '../types';
import { RowDataPacket } from 'mysql2';

export const getAllTreatmentHistories = async (): Promise<any[]> => {
  const [result] = await db.query<RowDataPacket[]>(
    `
    SELECT 
      th.history_id AS historyId,
      th.treatment_id AS treatmentId,
      t.name AS treatmentName,
      t.description,
      t.price,
      th.quantity,
      mh.date,
      mh.patient_id AS patientId,
      mh.dentist_id AS dentistId 
    FROM treatment_histories th 
    JOIN treatments t ON th.treatment_id = t.id 
    JOIN medical_histories mh ON th.history_id = mh.id
    `
  );
  return result as any[];
}

export const getTreatmentHistoryByMedicalHistoryId = async (id: number): Promise<any[]> => {
  const [result] = await db.query<RowDataPacket[]>(
    `
    SELECT 
      t.id AS treatmentId,
      t.name AS treatmentName,
      t.description,
      t.price,
      t.estimated_duration AS estimatedDuration,
      th.quantity 
    FROM treatment_histories th 
    JOIN treatments t ON th.treatment_id = t.id 
    WHERE th.history_id = ?
    `, [id]);
  return result as any[];
}

export const getTreatmentHistoryByTreatmentId = async (id: number): Promise<any[]> => {
  const [result] = await db.query<RowDataPacket[]>(
    `
    SELECT 
      th.history_id AS historyId,
      th.quantity,
      mh.date,
      mh.patient_id AS patientId,
      mh.diagnostic
    FROM treatment_histories th
    JOIN medical_histories mh ON th.history_id = mh.id
    WHERE th.treatment_id = ?
    `, [id]);
  return result as any[];
}

export const addTreatmentsToHistory = async (historyId: number, treatments: any[]) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO treatment_histories (history_id, treatment_id, quantity) 
      VALUES (?, ?, ?)
    `;

    for (const treatment of treatments) {
      await connection.query(insertQuery, [
        historyId,
        treatment.treatmentId,
        treatment.quantity
      ])
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}