/**
 * @module config/logger
 * @description Configuración y creación del logger utilizando Winston.
 * Este módulo configura el logger para registrar mensajes tanto en la consola como en archivos de log.
 * Incluye rotación diaria de archivos y formato personalizado para los mensajes de log.
 */

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
  level: 'debug', // Nivel mínimo de logs que se registran
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss', // Formato de la fecha y hora en los logs
    }),
    customFormat, // Aplicar formato personalizado
  ),
  transports: [
    // Registrar logs en la consola
    new transports.Console(),
    // Registrar logs en archivos con rotación diaria
    new DailyRotateFile({
      filename: path.join(logDirectory, '%DATE%.log'),
      datePattern: 'YYYY-MM-DD', // Patrón de fecha en el nombre del archivo
      maxSize: '5m', // Tamaño máximo del archivo de log antes de rotar
      maxFiles: '30d', // Número máximo de días para mantener los archivos de log
    }),
  ],
});

module.exports = logger;
