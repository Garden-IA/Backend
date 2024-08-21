const winston = require('winston');
const { format, transports } = winston;
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

// Crear el directorio 'logs' si no existe
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Formato personalizado para los logs
const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Configuración de Winston
const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss', // Formato de la fecha y hora
    }),
    customFormat,
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDirectory, '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '5m', // Tamaño máximo de archivo antes de rotar
      maxFiles: '30d', // Número de días para mantener los logs
    }),
  ],
});

module.exports = logger;
