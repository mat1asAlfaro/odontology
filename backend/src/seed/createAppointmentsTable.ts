import { Pool } from "mysql2/promise";

export default async function createAppointmentsTable(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS appointments`);

  await pool.query(`
    CREATE TABLE appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      dentist_id INT NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      status ENUM('pending', 'confirmed', 'canceled', 'attended'),
      comment TEXT,
      FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE,
      FOREIGN KEY (dentist_id) REFERENCES dentists (id) ON DELETE CASCADE
    )
  `);
};
