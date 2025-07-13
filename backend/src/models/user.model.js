const db = require("../config/db");

exports.getAllUsers = async () => {
  const [result] = await db.query(`SELECT * FROM users`);

  return result;
};

exports.getUserById = async (id) => {
  const [result] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);

  return result;
};

exports.getUserByEmail = async (email) => {
  const [result] = await db.query(`SELECT id FROM users WHERE email = ?`, [
    email,
  ]);

  return result;
};

exports.updateUser = async (
  id,
  firstName,
  lastName,
  email,
  password,
  phone
) => {
  const [result] = await db.query(
    `
    UPDATE users SET 
      first_name = ?,
      last_name = ?,
      email = ?,
      password = ?,
      phone = ? 
    WHERE id = ?
    `,
    [firstName, lastName, email, password, phone, id]
  );

  return result;
};

exports.updateUserStatus = async (id, status) => {
  const [result] = await db.query(
    `
    UPDATE users SET
      status = ? 
    WHERE id = ?
    `,
    [status, id]
  );

  return result;
};
