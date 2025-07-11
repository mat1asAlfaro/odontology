const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting users: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (result.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json(result[0]);
  } catch (error) {
    console.error("Error getting user by id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createAdmin = async (req, res) => {
  const { firstName, lastName, email, password, role, phone } = req.body;

  const connection = await pool.getConnection();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, "ADMIN", phone]
    );

    const userId = userResult.insertId;

    res.status(201).json({
      id: userId,
      firstName,
      lastName,
      email,
      hashedPassword,
      role,
      phone,
    });
  } catch (error) {
    console.error("Error creating admin: ", error);
    res.status(500).json({ error: "Admin could not be created" });
  }
};

exports.createDentist = async (req, res) => {
  const { firstName, lastName, email, password, phone, specialty } = req.body;

  const connection = await pool.getConnection();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await connection.query(
      "INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, "DENTIST", phone]
    );

    const userId = userResult.insertId;

    await connection.query(
      "INSERT INTO dentists (user_id, specialty) VALUES (?, ?)",
      [userId, specialty]
    );

    await connection.commit();

    res.status(201).json({
      id: userId,
      firstName,
      lastName,
      email,
      hashedPassword,
      role: "DENTIST",
      phone,
      specialty,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating dentist:", error);
    res.status(500).json({ error: "Dentist could not be created" });
  } finally {
    connection.release();
  }
};

exports.createPatient = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    ci,
    birthdate,
    address,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await connection.query(
      "INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, "PATIENT", phone]
    );

    const userId = userResult.insertId;

    await connection.query(
      "INSERT INTO patients (user_id, ci, birthdate, address) VALUES (?, ?, ?, ?)",
      [userId, ci, birthdate, address]
    );

    await connection.commit();

    res.status(201).json({
      id: userId,
      firstName,
      lastName,
      email,
      hashedPassword,
      role: "PATIENT",
      phone,
      ci,
      birthdate,
      address,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating patient:", error);
    res.status(500).json({ error: "Patient could not be created" });
  } finally {
    connection.release();
  }
};
