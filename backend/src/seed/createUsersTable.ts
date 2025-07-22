import { Pool } from 'mysql2/promise'

export default async function createUsersTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS users`);

  await pool.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      role ENUM('admin', 'patient', 'dentist') NOT NULL,
      phone VARCHAR(20),
      status BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_rol (role)
    )
  `);
};
