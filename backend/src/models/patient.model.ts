import db from '../config/db';
import { Patient } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getPatientById = async (userId: number): Promise<Patient[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM patients WHERE user_id = ?`, [userId]);
  return result as Patient[];
}

export const getPatientByCi = async (ci: string): Promise<Patient[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM patients WHERE ci = ?`, [ci]);
  return result as Patient[];
}

export const createPatient = async (userId: number, data: Patient): Promise<ResultSetHeader> => {
  const { ci, birthdate, address } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO patients (user_id, ci, birthdate, address) 
      VALUES  (?, ?, ?, ?)  
      `,
      [userId, ci, birthdate, address]
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

export const updatePatient = async (id: number, data: Patient): Promise<ResultSetHeader> => {
  const { ci, birthdate, address } = data;

  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE patients SET
      ci = ?,
      birthdate = ?,
      address = ? 
    WHERE id = ?
    `,
    [ci, birthdate, address, id]
  );

  return result;
};
