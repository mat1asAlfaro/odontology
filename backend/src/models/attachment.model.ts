import db from '../config/db';
import { Attachment } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAttachmentById = async (id: number): Promise<Attachment[]> => {
  const [result] = await db.query<RowDataPacket[]>(
    `SELECT 
        id, 
        history_id AS historyId, 
        file_name AS fileName, 
        file_path AS filePath, 
        file_type AS fileType, 
        upload_date AS uploadDate 
    FROM 
        attachments 
    WHERE id = ?`, 
    [id]
  );

  return result as Attachment[];
};

export const getHistoryAttachments = async (historyId: number): Promise<Attachment[]> => {
    const [result] = await db.query<RowDataPacket[]>(
        `SELECT 
            id, 
            history_id AS historyId, 
            file_name AS fileName, 
            file_path AS filePath, 
            file_type AS fileType, 
            upload_date AS uploadDate 
        FROM 
        attachments 
        WHERE history_id = ?`, 
        [historyId]
    );
    return result as Attachment[];
};

export const createAttachment = async (metaData: Attachment): Promise<ResultSetHeader> => {
    const { historyId, fileName, filePath, fileType, uploadDate } = metaData;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await db.query<ResultSetHeader>(
        `
        INSERT INTO attachments (history_id, file_name, file_path, file_type, upload_date) 
        VALUES (?, ?, ?, ?, ?)
        `, 
        [historyId, fileName, filePath, fileType, uploadDate]
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

export const deleteAttachmant = async (id: number): Promise<ResultSetHeader> => {
    const [result] = await db.query<ResultSetHeader>(
        `DELETE FROM attachments WHERE id = ?`,
        [id]
    );
    return result;
};

