/**
 * @module config/database
 * @description Configuración y conexión a la base de datos MongoDB utilizando Mongoose.
 * Este módulo se encarga de establecer la conexión con MongoDB y manejar posibles errores.
 */

const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

/**
 * Conecta a la base de datos MongoDB utilizando la URI proporcionada en las variables de entorno.
 * Maneja la conexión con Mongoose y proporciona logs detallados para el estado de la conexión.
 *
 * @async
 * @function connectToDatabase
 * @throws {Error} Si ocurre un error durante la conexión a la base de datos, se registra el error y se termina el proceso.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la conexión a la base de datos es exitosa.
 */
const connectToDatabase = async () => {
  try {
    logger.info('Intentando conectar a MongoDB...');

    // Conectar a MongoDB usando la URI definida en las variables de entorno
    await mongoose.connect(process.env.MONGO_URI, {});

    logger.info('Conexión a MongoDB exitosa');
  } catch (err) {
    // Registrar error y traza del stack si la conexión falla
    logger.error(`Error en la conexión a MongoDB: ${err.message}`);
    logger.debug(err.stack); // Detalle del stack trace en modo debug

    // Terminar el proceso con un código de error
    process.exit(1);
  }
};

module.exports = connectToDatabase;
