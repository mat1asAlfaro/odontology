import { Pool } from 'mysql2/promise'

export default async function createTreatmentHistoryTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS treatment_histories`);

  await pool.query(`
    CREATE TABLE treatment_histories (
      history_id INT NOT NULL,
      treatment_id INT NOT NULL,
      quantity INT,
      FOREIGN KEY (history_id) REFERENCES medical_histories (id) ON DELETE CASCADE,
      FOREIGN KEY (treatment_id) REFERENCES treatments (id) ON DELETE CASCADE
    )
  `);
};
