const db = require("../config/db");
const { updateUser } = require("./user.model");

exports.createAdmin = async (data) => {
  const { firstName, lastName, email, password, phone, accessLevel } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `
      INSERT INTO users (first_name, last_name, email, password, role, phone) 
      VALUES (?, ?, ?, ?, ?, ?)  
      `,
      [firstName, lastName, email, password, "ADMIN", phone]
    );

    const userId = userResult.insertId;

    await connection.query(
      `
      INSERT INTO admins (user_id, access_level) 
      VALUES  (?, ?)  
      `,
      [userId, accessLevel]
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

exports.updateAdmin = async (id, data) => {
  const { firstName, lastName, email, password, phone, accessLevel } = data;

  const userResult = await updateUser(
    id,
    firstName,
    lastName,
    email,
    password,
    phone
  );

  const [adminResult] = await db.query(
    `
    UPDATE admins SET
      access_level = ? 
    WHERE id = ?
    `,
    [accessLevel, id]
  );

  return { userResult, adminResult };
};
