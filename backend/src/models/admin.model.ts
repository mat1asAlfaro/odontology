import db from '../config/db';
import { Admin } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAdminById = async (userId: number): Promise<Admin[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM admins WHERE user_id = ?`, [userId]);
  return result as Admin[];
}

export const createAdmin = async (userId: number, data: Admin): Promise<ResultSetHeader> => {
  const { accessLevel } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO admins (user_id, access_level) 
      VALUES  (?, ?)  
      `,
      [userId, accessLevel]
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

export const updateAdmin = async (id: number, data: Admin): Promise<ResultSetHeader> => {
  const { accessLevel } = data;

  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE admins SET
      access_level = ? 
    WHERE id = ?
    `,
    [accessLevel, id]
  );

  return result;
};
