const db = require("../config/db");
const { updateUser } = require("./user.model");

exports.createPatient = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    ci,
    birthdate,
    address,
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `
      INSERT INTO users (first_name, last_name, email, password, role, phone) 
      VALUES (?, ?, ?, ?, ?, ?)  
      `,
      [firstName, lastName, email, password, "PATIENT", phone]
    );

    const userId = userResult.insertId;

    await connection.query(
      `
      INSERT INTO patients (user_id, ci, birthdate, address) 
      VALUES  (?, ?, ?, ?)  
      `,
      [userId, ci, birthdate, address]
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

exports.updatePatient = async (id, data) => {
  const { ...userData } = data;

  const userResult = await updateUser(id, userData);

  const [patientResult] = await db.query(
    `
    UPDATE patients SET
      ci = ?,
      birthdate = ?,
      address = ? 
    WHERE id = ?
    `,
    [userData.ci, userData.birthdate, userData.address, id]
  );

  return { userResult, patientResult };
};
