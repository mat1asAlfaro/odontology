import db from '../config/db';
import { MedicalHistory } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllMedicalHistories = async (): Promise<MedicalHistory[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM medical_histories`);
  return result as MedicalHistory[];
};

export const getMedicalHistoryById = async (id: number): Promise<MedicalHistory[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM medical_histories WHERE id = ?`, [id]);
  return result as MedicalHistory[];
}

export const createMedicalHistory = async (data: MedicalHistory): Promise<ResultSetHeader> => {
  const { patientId, dentistId, date, diagnostic, treatmentPerformed, observations } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO medical_histories (patient_id, dentist_id, date, diagnostic, treatment_performed, observations) 
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [patientId, dentistId, date, diagnostic, treatmentPerformed, observations]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export const updateMedicalHistory = async (id: number, medicalHistoryData: MedicalHistory): Promise<ResultSetHeader> => {
  const { patientId, dentistId, date, diagnostic, treatmentPerformed, observations } = medicalHistoryData;

  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE medical_histories SET 
      patient_id = ?,
      dentist_id = ?,
      date = ?,
      diagnostic = ?,
      treatment_performed = ?,
      observations = ?  
    WHERE id = ?
    `,
    [patientId, dentistId, date, diagnostic, treatmentPerformed, observations, id]
  );

  return result;
}

export const updateMedicalHistoryDiagnostic = async (id: number, diagnostic: string): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE medical_histories SET 
      diagnostic = ? 
    WHERE id = ?
    `,
    [diagnostic, id]
  );

  return result;
}

export const updateMedicalHistoryTreatmentPerformed = async (id: number, treatmentPerformed: string): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE medical_histories SET 
      treatment_performed = ? 
    WHERE id = ?
    `,
    [treatmentPerformed, id]
  );

  return result;
}

export const updateMedicalHistoryObservations = async (id: number, observations: string): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE medical_histories SET 
      observations = ? 
    WHERE id = ?
    `,
    [observations, id]
  );

  return result;
}

export const getMedicalHistoriesByPatientId = async (patientId: number): Promise<MedicalHistory[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM medical_histories WHERE patient_id = ?`, [patientId]);
  return result as MedicalHistory[];
}

export const getMedicalHistoriesByDentistId = async (dentistId: number): Promise<MedicalHistory[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM medical_histories WHERE dentist_id = ?`, [dentistId]);
  return result as MedicalHistory[];
}