import { Pool } from "mysql2/promise";

export default async function createAttachmentsTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS attachments`);

  await pool.query(`
    CREATE TABLE attachments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      history_id INT NOT NULL,
      url_file TEXT,
      file_type VARCHAR(50),
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (history_id) REFERENCES medical_history(id) ON DELETE CASCADE
    )
  `);
}
