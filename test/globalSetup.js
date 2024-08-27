// test/globalSetup.js
const mongoose = require('mongoose');
const logger = require('../src/config/logger');

module.exports = async () => {
  const dbUri = 'mongodb://localhost:27017/testdb'; // Cambia esto a la URI de tu base de datos de pruebas

  logger.info('Conectando a la base de datos de pruebas...');

  try {
    await mongoose.connect(dbUri);
    logger.info('Conexión a la base de datos de pruebas establecida con éxito');
  } catch (error) {
    logger.error(`Error al conectar a la base de datos de pruebas: ${error.message}`);
    process.exit(1);
  }
};
