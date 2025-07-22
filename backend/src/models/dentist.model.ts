import db from '../config/db';
import { Dentist } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getDentistById = async (userId: number): Promise<Dentist[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM dentists WHERE user_id = ?`, [userId]);
  return result as Dentist[];
}

export const createDentist = async (userId: number, data: Dentist): Promise<ResultSetHeader> => {
  const { specialty } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO dentists (user_id, specialty) 
      VALUES  (?, ?)  
      `,
      [userId, specialty]
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

export const updateDentist = async (id: number, data: Dentist): Promise<ResultSetHeader> => {
  const { specialty } = data;

  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE dentists SET 
      specialty = ?
    WHERE id = ?
  `,
    [specialty, id]
  );

  return result;
};
