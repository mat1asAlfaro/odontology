import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import bcrypt from "bcrypt";
import { logger, logWithFile } from "../services/logger";
const log = logWithFile(logger, __filename);

import { UserModel, AdminModel, PatientModel, DentistModel } from '../models';

import { User, Admin, Patient, Dentist } from '../types'

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await UserModel.getAllUsers();

    const roleHandlers: Record<User['role'], (id: number) => Promise<object>> = {
      admin: async (id) => {
        const [admin] = await AdminModel.getAdminById(id);
        return admin || {};
      },
      patient: async (id) => {
        const [patient] = await PatientModel.getPatientById(id);
        return patient || {};
      },
      dentist: async (id) => {
        const [dentist] = await DentistModel.getDentistById(id);
        return dentist || {};
      },
    }

    const mergedUsers = await Promise.all(
      users.map(async (user) => {
        const extraData = await roleHandlers[user.role](user.id!);
        return { ...user, ...extraData };
      })
    )

    res.json(mergedUsers);
  } catch (error) {
    log.error("Error getting users: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  try {
    const [user]: User[] = await UserModel.getUserById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const roleHandlers: Record<User['role'], () => Promise<object>> = {
      admin: async () => {
        const [admin]: Admin[] = await AdminModel.getAdminById(id);
        return { ...user, ...admin };
      },
      patient: async () => {
        const [patient]: Patient[] = await PatientModel.getPatientById(id);
        return { ...user, ...patient };
      },
      dentist: async () => {
        const [dentist]: Dentist[] = await DentistModel.getDentistById(id);
        return { ...user, ...dentist };
      },
    }

    const mergedUser = await roleHandlers[user.role]();
    res.json(mergedUser);
  } catch (error) {
    log.error("Error getting user by id: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
    status,
    ...userTypeData
  } = req.body;

  const userExists = await UserModel.getUserByEmail(email);
  if (userExists.length !== 0) {
    return res.status(409).json({
      message: "User exists",
    });
  }

  if (userTypeData.ci && role === "patient") {
    const patientExists = await PatientModel.getPatientByCi(userTypeData.ci);
    if (patientExists.length !== 0) {
      return res.status(409).json({
        message: "Patient with this CI already exists",
      });
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: User = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      phone,
      status,
    };

    const userResult: ResultSetHeader = await UserModel.createUser(userData);
    const userId = userResult.insertId;

    switch (role) {
      case "admin":
        await AdminModel.createAdmin(userId, userTypeData);
        break;
      case "patient":
        await PatientModel.createPatient(userId, userTypeData);
        break;
      case "dentist":
        await DentistModel.createDentist(userId, userTypeData);
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(201).json({
      message: `User ${ role } created successfully`,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "User could not be created" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const id = parseInt(req.params.id, 10);
  const { firstName, lastName, email, role, phone, ...userTypeData } = req.body;

  const userIdExists = await UserModel.getUserById(id);
  if (userIdExists.length === 0) {
    return res.status(400).json({
      message: "Non-existent user id",
    });
  }

  const userEmailExists = await UserModel.getUserByEmail(email);
  if (userEmailExists.length === 0) {
    return res.status(400).json({
      message: "Non-existent user email",
    });
  }

  try {
    const userData: User = {
      firstName,
      lastName,
      email,
      role: role.toUpperCase(),
      phone,
    };

    await UserModel.updateUser(id, userData);

    switch (userData.role) {
      case "admin":
        await AdminModel.updateAdmin(id, userTypeData);
        break;
      case "patient":
        await PatientModel.updatePatient(id, userTypeData);
        break;
      case "dentist":
        await DentistModel.updateDentist(id, userTypeData);
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    res.json({ message: `User ${ role } updated successfully` });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating user"
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<any> => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const userIdExists = await UserModel.getUserById(id);
  if (userIdExists.length === 0) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  try {
    await UserModel.updateUserStatus(id, status);

    res.json({ message: `User status updated successfully` });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating user status"
    });
  }
};

export const updateUserPassword = async (req: Request, res: Response): Promise<any> => {
  const id = parseInt(req.params.id, 10);
  const { password } = req.body;

  const userIdExists = await UserModel.getUserById(id);
  if (userIdExists.length === 0) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateUserPassword(id, hashedPassword);

    res.json({ message: `User password updated successfully` });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating user password"
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    await UserModel.deleteUser(id, false);

    res.json({ message: `User deleted successfully` });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: "Error updating user role"
    });
  }
};
