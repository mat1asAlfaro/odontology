import { Pool } from 'mysql2/promise'

export default async function createDentistsTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS patients`);

  await pool.query(`
    CREATE TABLE patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      ci VARCHAR(20) NOT NULL UNIQUE,
      birthdate DATE,
      address VARCHAR(100),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_ci (ci)
    )
  `);
};
