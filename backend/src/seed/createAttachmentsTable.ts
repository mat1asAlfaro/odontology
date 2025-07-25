import { Pool } from "mysql2/promise";

export default async function createAttachmentsTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS attachments`);

  await pool.query(`
    CREATE TABLE attachments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      history_id INT NOT NULL,
      file_path TEXT,
      file_name VARCHAR(100),
      file_type VARCHAR(50),
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (history_id) REFERENCES medical_histories(id) ON DELETE CASCADE
    )
  `);
}
