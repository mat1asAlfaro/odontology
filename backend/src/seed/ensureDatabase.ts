import * as dotenv from 'dotenv';
import mysql, { Connection } from 'mysql2/promise';

dotenv.config();

export default async function ensureDatabaseExists(): Promise<void> {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PORT || !DB_NAME) {
    throw new Error('Required environment variables for database are missing');
  }

  const connection: Connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT, 10),
  });

  const dbName = process.env.DB_NAME;

  const [databases] = await connection.query<any[]>(
    'SHOW DATABASES LIKE ?',
    [dbName]
  );

  if (databases.length === 0)
    await connection.query(`CREATE DATABASE \`${ dbName }\``);

  await connection.end();
}