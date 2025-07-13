const db = require("../config/db");

exports.createDentist = async (data) => {
  const { firstName, lastName, email, password, phone, specialty } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `
      INSERT INTO users (first_name, last_name, email, password, role, phone) 
      VALUES (?, ?, ?, ?, ?, ?)  
      `,
      [firstName, lastName, email, password, "DENTIST", phone]
    );

    const userId = userResult.insertId;

    await connection.query(
      `
      INSERT INTO dentists (user_id, specialty) 
      VALUES  (?, ?)  
      `,
      [userId, specialty]
    );

    await connection.commit();

    return userResult;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateDentist = async (id, data) => {
  const { firstName, lastName, email, password, phone, specialty } = data;

  const [result] = await db.query(
    `
    UPDATE dentists SET 
      first_name = ?,
      last_name = ?,
      email = ?,
      password = ?,
      phone = ?,
      specialty = ?
    WHERE id = ?
  `,
    [firstName, lastName, email, password, phone, specialty, id]
  );

  return result;
};
