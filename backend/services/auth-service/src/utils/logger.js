const winston = require('winston');
const { format, transports } = winston;
const path = require('path');
const config = require('../../../shared/config');

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create console transport for development
const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.printf(
      ({ level, message, timestamp, stack, ...meta }) => {
        const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
        const stackString = stack ? `\n${stack}` : '';
        return `${timestamp} ${level}: ${message}${metaString}${stackString}`;
      }
    )
  ),
});

// Create file transports for production
const fileTransports = [
  // - Write all logs with level `error` and below to `error.log`
  new transports.File({
    filename: path.join(__dirname, '../../../logs/error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  // - Write all logs with level `info` and below to `combined.log`
  new transports.File({
    filename: path.join(__dirname, '../../../logs/combined.log'),
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: logFormat,
  defaultMeta: { service: 'auth-service' },
  transports: [
    // Write all logs to console in development
    ...(config.env === 'development' ? [consoleTransport] : []),
    // Write to files in production
    ...(config.env === 'production' ? fileTransports : []),
  ],
  exitOnError: false, // Don't exit on handled exceptions
});

// Handle uncaught exceptions
if (config.env === 'production') {
  process.on('unhandledRejection', (reason) => {
    throw reason; // Let the uncaughtException handler handle it
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // Perform any cleanup if needed
    process.exit(1); // Exit with failure
  });
}

// Create a stream for Morgan (HTTP request logging)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
