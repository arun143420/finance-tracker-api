import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: false }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    if (typeof message === "object") {
      const { method, url, status, duration, ...rest } = message;
      return `${timestamp} ${method} ${url} ${status} (${duration})`;
    }
    return `${timestamp} [${level}] : ${message}`;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.File({
      filename: join(__dirname, '../../logs/error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: join(__dirname, '../../logs/combined.log')
    })
  ]
});

export default logger;
