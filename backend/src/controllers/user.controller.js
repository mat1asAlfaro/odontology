const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { logger, logWithFile } = require("../services/logger");
const log = logWithFile(logger, __filename);

const UserModel = require("../models/user.model");
const AdminModel = require("../models/admin.model");
const PatientModel = require("../models/patient.model");
const DentistModel = require("../models/dentist.model");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await UserModel.getAllUsers();
    res.json(result);
  } catch (error) {
    log.error("Error getting users: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await UserModel.getUserById(id);

    if (result.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json(result[0]);
  } catch (error) {
    log.error("Error getting user by id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, role, ...userData } = req.body;

  const userExists = await UserModel.getUserByEmail(email);
  if (userExists.length !== 0) {
    return res.status(409).json({
      message: "User exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let userResult;

    const finalUserData = { ...userData, email, password: hashedPassword };

    switch (role) {
      case "admin":
        userResult = await AdminModel.createAdmin(finalUserData);
        break;
      case "patient":
        userResult = await PatientModel.createPatient(finalUserData);
        break;
      case "dentist":
        userResult = await DentistModel.createDentist(finalUserData);
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(201).json({
      message: `User ${role} created successfully`,
    });
  } catch (error) {
    log.error("Error creating user:", error);
    res.status(500).json({ error: "User could not be created" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, role, ...userData } = req.body;

  const userIdExists = await UserModel.getUserById(id);
  if (userIdExists.length === 0) {
    return res.status(400).json({
      message: "Non-existent user id",
    });
  }

  const userEmailExists = await UserModel.getUserByEmail(email);
  if (userEmailExists.length === 0) {
    log.info("EMAIL: ", email);
    return res.status(400).json({
      message: "Non-existent user email",
    });
  }

  try {
    let result;

    const finalUserData = { ...userData, email };

    switch (role) {
      case "admin":
        result = await AdminModel.updateAdmin(id, finalUserData);
        break;
      case "patient":
        result = await PatientModel.updatePatient(id, finalUserData);
        break;
      case "dentist":
        result = await DentistModel.updateDentist(id, finalUserData);
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    res.json({ message: `User ${role} updated successfully`, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await UserModel.updateUserStatus(id, status);

    res.json({ message: `User role updated successfully`, result });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating user role",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await UserModel.updateUserStatus(id, 0);

    res.json({ message: `User deleted successfully`, result });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating user role",
      error: error.message,
    });
  }
};
