module.exports = async function (pool) {
  await pool.query(`DROP TABLE IF EXISTS dentists`);
  await pool.query(`
    CREATE TABLE dentists (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      specialty VARCHAR(50),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
