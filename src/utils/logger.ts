import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Define the format for console output
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// Only console transport
const transports = [
  new winston.transports.Console({
    format: combine(colorize({ all: true }), logFormat),
  }),
];

const logger = winston.createLogger({
  // Set the level based on the environment, allowing all logs in development
  level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
  levels,
  transports,
});

export default logger;