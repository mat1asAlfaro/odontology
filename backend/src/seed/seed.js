const pool = require("../config/db");
const { logger, logWithFile } = require("../services/logger");
const log = logWithFile(logger, __filename);
const createUsersTable = require("./createUserTable");
const createAdminTable = require("./createAdminTable");
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
    await createAdminTable(pool);
    await createPatientTable(pool);
    await createDentistTable(pool);
    await createAppointmentTable(pool);
    await createMedicalHistoryTable(pool);
    await createTreatmentTable(pool);
    await createHistoryTreatmentTable(pool);
    await createAttachmentsTable(pool);
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
    log.info("Tables created successfully.");
  } catch (error) {
    log.error("Error creating tables: ", error);
  }
}

module.exports = seed;
