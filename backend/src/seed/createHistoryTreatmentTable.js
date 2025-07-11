module.exports = async function (pool) {
  await pool.query(`DROP TABLE IF EXISTS history_treatment`);
  await pool.query(`
    CREATE TABLE history_treatment (
      history_id INT NOT NULL,
      treatment_id INT NOT NULL,
      quantity INT,
      FOREIGN KEY (history_id) REFERENCES medical_history (id) ON DELETE CASCADE,
      FOREIGN KEY (treatment_id) REFERENCES treatments (id) ON DELETE CASCADE
    )
  `);
};
