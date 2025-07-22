import { Pool } from "mysql2/promise";

export default async function createAdminsTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS admins`);

  await pool.query(`
    CREATE TABLE admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      access_level INT DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}
