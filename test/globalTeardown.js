// test/globalTeardown.js
const mongoose = require('mongoose');
const logger = require('../src/config/logger');

const House = require('../src/features/house/model');

module.exports = async () => {
  logger.info('Borrando todas las casas creadas');
  await House.deleteMany({});

  logger.info('Desconectando de la base de datos de pruebas...');

  try {
    await mongoose.disconnect();
    await mongoServer.stop();
    logger.info('Desconexión de la base de datos de pruebas realizada con éxito');
  } catch (error) {
    logger.error(`Error al desconectar de la base de datos de pruebas: ${error.message}`);
    process.exit(1);
  }
};
