const pool = require("../config/db");
const createUsersTable = require("./createUserTable");
const createPatientTable = require("./createPatientTable");
const createDentistTable = require("./createDentistTable");
const createAppointmentTable = require("./createAppointmentTable");
const createMedicalHistoryTable = require("./createMedicalHistoryTable");
const createTreatmentTable = require("./createTreatmentTable");
const createHistoryTreatmentTable = require("./createHistoryTreatmentTable");
const createAttachmentsTable = require("./createAttachmentsTable");

async function seed() {
  try {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    await createUsersTable(pool);
    await createPatientTable(pool);
    await createDentistTable(pool);
    await createAppointmentTable(pool);
    await createMedicalHistoryTable(pool);
    await createTreatmentTable(pool);
    await createHistoryTreatmentTable(pool);
    await createAttachmentsTable(pool);
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables: ", error);
  }
}

module.exports = seed;
