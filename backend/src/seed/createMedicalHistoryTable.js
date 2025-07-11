module.exports = async function (pool) {
  await pool.query(`DROP TABLE IF EXISTS medical_history`);
  await pool.query(`
    CREATE TABLE medical_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      dentist_id INT NOT NULL,
      date DATE,
      diagnosis TEXT,
      treatment_performed TEXT,
      observations TEXT,
      FOREIGN KEY (patient_id) REFERENCES patient (id) ON DELETE CASCADE,
      FOREIGN KEY (dentist_id) REFERENCES dentist (id) ON DELETE CASCADE
    )
  `);
};
