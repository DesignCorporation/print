import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json, colorize, printf } = format;

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new transports.Console({
      format: isDev ? combine(colorize(), timestamp(), devFormat) : combine(timestamp(), json()),
    }),
  ],
});
