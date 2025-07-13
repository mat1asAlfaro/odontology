const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const isDev = process.env.NODE_ENV !== "production";

const logger = createLogger({
  level: isDev ? "debug" : "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      silent: !isDev,
    }),

    new transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
    }),

    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
  ],
});

const logWithFile = (logger, filePath) => {
  return {
    info: (...args) =>
      logger.info(`[${path.basename(filePath)}] ${args.join(" ")}`),
    warn: (...args) =>
      logger.warn(`[${path.basename(filePath)}] ${args.join(" ")}`),
    error: (...args) =>
      logger.error(`[${path.basename(filePath)}] ${args.join(" ")}`),
    debug: (...args) =>
      logger.debug(`[${path.basename(filePath)}] ${args.join(" ")}`),
  };
};

module.exports = { logger, logWithFile };
