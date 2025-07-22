import { createLogger, format, transports, Logger } from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const isDev = process.env.NODE_ENV !== 'production';

export const logger: Logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) =>
        `[${ timestamp }] ${ level.toUpperCase() }: ${ message }`
    )
  ),
  transports: [
    new transports.Console({
      silent: !isDev,
    }),

    new transports.File({
      filename: path.join(logDir, 'app.log'),
      level: 'info',
    }),

    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
  ],
});

type LogWithFile = {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

export function logWithFile(logger: Logger, filePath: string): LogWithFile {
  return {
    info: (...args) =>
      logger.info(`[${ path.basename(filePath) }] ${ args.join(' ') }`),
    warn: (...args) =>
      logger.warn(`[${ path.basename(filePath) }] ${ args.join(' ') }`),
    error: (...args) =>
      logger.error(`[${ path.basename(filePath) }] ${ args.join(' ') }`),
    debug: (...args) =>
      logger.debug(`[${ path.basename(filePath) }] ${ args.join(' ') }`),
  };
};