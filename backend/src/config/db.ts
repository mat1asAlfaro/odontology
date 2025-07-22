import * as dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME || !DB_PORT) {
  throw new Error('Required environment variables for database are missing');
}

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT, 10),
  database: DB_NAME,
});

export default pool;
