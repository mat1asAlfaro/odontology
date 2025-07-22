import { Pool } from 'mysql2/promise'

export default async function createTreatmentsTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS treatments`);

  await pool.query(`
    CREATE TABLE treatments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      description TEXT,
      price DECIMAL(10, 2),
      estimated_duration INT
    )
  `);
};
