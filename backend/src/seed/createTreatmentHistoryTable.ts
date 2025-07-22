import { Pool } from 'mysql2/promise'

export default async function createTreatmentHistoryTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS treatment_history`);

  await pool.query(`
    CREATE TABLE treatment_history (
      history_id INT NOT NULL,
      treatment_id INT NOT NULL,
      quantity INT,
      FOREIGN KEY (history_id) REFERENCES medical_history (id) ON DELETE CASCADE,
      FOREIGN KEY (treatment_id) REFERENCES treatments (id) ON DELETE CASCADE
    )
  `);
};
