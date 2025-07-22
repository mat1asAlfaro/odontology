import db from '../config/db';
import { Appointment } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM appointments`);
  return result as Appointment[];
};

export const getAppointmentById = async (id: number): Promise<Appointment[]> => {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM appointments WHERE id = ?`, [
    id,
  ]);
  return result as Appointment[];
};

export const createAppointment = async (data: Appointment): Promise<ResultSetHeader> => {
  const { patientId, dentistId, date, time, status, comment } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await db.query<ResultSetHeader>(
      `
    INSERT INTO appointments (patient_id, dentist_id, date, time, status, comment) 
    VALUES (?, ?, ?, ?, ?, ?)
    `,
      [patientId, dentistId, date, time, status, comment]
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

export const updateAppointment = async (id: number, appointmentData: Appointment): Promise<ResultSetHeader> => {
  const { patientId, dentistId, date, time, comment } = appointmentData;

  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE appointments SET 
      patient_id = ?,
      dentist_id = ?,
      date = ?,
      time = ?,
      comment = ? 
    WHERE id = ?
    `,
    [patientId, dentistId, date, time, comment, id]
  );

  return result;
};

export const updateAppointmentStatus = async (id: number, status: boolean): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE appointments SET 
      status = ? 
    WHERE id = ?
    `,
    [status, id]
  );

  return result;
};

export const updateAppointmentDate = async (id: number, date: string): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE appointments SET 
      date = ? 
    WHERE id = ?
    `,
    [date, id]
  );

  return result;
}

export const updateAppointmentTime = async (id: number, time: string): Promise<ResultSetHeader> => {
  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE appointments SET 
      time = ? 
    WHERE id = ?
    `,
    [time, id]
  );

  return result;
}