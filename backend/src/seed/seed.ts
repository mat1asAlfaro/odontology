import ensureDatabaseExists from './ensureDatabase'
import pool from '../config/db';
import { logger, logWithFile } from '../services/logger';
import * as tables from './index';
import { Pool } from 'mysql2/promise';

const log = logWithFile(logger, __filename);

export default async function seed(): Promise<void> {
  const db = pool as Pool;
  const seedFunctions = Object.values(tables);

  try {
    await ensureDatabaseExists();
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const seedFn of seedFunctions)
      await seedFn(db);

    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    log.info('✅ Database seeded successfully.');
  } catch (error) {
    log.error('Error creating tables: ', error);
  }
}