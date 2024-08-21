const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

const connectToDatabase = async () => {
  try {
    logger.info('Intentando conectar a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {});
    logger.info('Conexión a MongoDB exitosa');
  } catch (err) {
    logger.error(`Error en la conexión a MongoDB: ${err.message}`);
    logger.debug(err.stack); // Detalle del stack trace en modo debug
    process.exit(1);
  }
};

module.exports = connectToDatabase;
