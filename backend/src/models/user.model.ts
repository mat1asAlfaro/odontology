import db from '../config/db';
import { User, Patient, Dentist } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllUsers = async (): Promise<User[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM users`);
  return result as User[];
};

export const getUserById = async (id: number): Promise<User[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM users WHERE id = ?`, [id]);
  return result as User[];
};

export const getUserByPatientId = async (id: number): Promise<Patient[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM patients WHERE id = ?`, [id]);
  return result as Patient[];
};

export const getUserByDentistId = async (id: number): Promise<Dentist[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM dentists WHERE id = ?`, [id]);
  return result as Dentist[];
};

export const getUserByEmail = async (email: string): Promise<{ id: number }[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT id FROM users WHERE email = ?`, [
    email,
  ]);
  return result as { id: number }[];
};

export const createUser = async (data: User): Promise<ResultSetHeader> => {
  const { firstName, lastName, email, password, role, phone, status } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await db.query<ResultSetHeader>(
      `
    INSERT INTO users (first_name, last_name, email, password, role, phone, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [firstName, lastName, email, password, role, phone, status]
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

export const updateUser = async (id: number, userData: User): Promise<ResultSetHeader> => {
  const { firstName, lastName, email, phone } = userData;

  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE users SET 
      first_name = ?,
      last_name = ?,
      email = ?,
      phone = ? 
    WHERE id = ?
    `,
    [firstName, lastName, email, phone, id]
  );

  return result;
};

export const updateUserStatus = async (id: number, status: boolean): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE users SET 
      status = ? 
    WHERE id = ?
    `,
    [status, id]
  )

  return result;
}

export const updateUserPassword = async (id: number, password: string): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE users SET 
      password = ? 
    WHERE id = ?
    `,
    [password, id]
  );

  return result;
};

export const deleteUser = async (id: number, status: boolean): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE users SET
      status = ? 
    WHERE id = ?
    `,
    [status, id]
  );

  return result;
};
