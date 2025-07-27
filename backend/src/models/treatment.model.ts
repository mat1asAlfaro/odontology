import db from '../config/db';
import { Treatment } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllTreatments = async (): Promise<Treatment[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM treatments`);
  return result as Treatment[];
}

export const getTreatmentById = async (id: number): Promise<Treatment[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM treatments WHERE id = ?`, [id]);
  return result as Treatment[];
}

export const getTreatmentsByPatientId = async (id: number): Promise<Treatment[]> => {
  const [result] = await db.query<RowDataPacket[]>(
    `
    SELECT 
      t.id,
      t.name,
      t.description,
      th.quantity,
      mh.date
    FROM treatment_histories th 
    JOIN treatments t ON th.treatment_id = t.id 
    JOIN medical_histories mh ON th.history_id = mh.id
    WHERE 
      mh.patient_id = ?
    `
    , [id]
  );
  return result as Treatment[];
}

export const createTreatment = async (data: Treatment): Promise<ResultSetHeader> => {
  const { name, description, price, estimatedDuration } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO treatments (name, description, price, estimated_duration) 
      VALUES  (?, ?, ?, ?)  
      `,
      [name, description, price, estimatedDuration]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateTreatment = async (id: number, treatmentData: Treatment): Promise<ResultSetHeader> => {
  const { name, description, price, estimatedDuration } = treatmentData;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `
      UPDATE treatments SET 
        name = ?,
        description = ?,
        price = ?,
        estimated_duration = ?  
      WHERE id = ?
      `,
      [name, description, price, estimatedDuration, id]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteTreatment = async (id: number): Promise<ResultSetHeader> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `
      DELETE FROM treatments WHERE id = ?
      `,
      [id]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};