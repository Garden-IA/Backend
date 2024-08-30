/**
 * @module features/house/service
 * @description Definición de los servicios de la casa.
 */

const House = require('./model'); // Ajusta la ruta según la ubicación del modelo
const logger = require('../../config/logger');
const User = require('../auth/model');

/**
 * Crea una nueva casa y la asocia al usuario especificado.
 *
 * @param {string} name - El nombre de la casa.
 * @param {string} location - La ubicación de la casa.
 * @param {string} [description] - Una descripción opcional de la casa.
 * @param {string} userId - El ID del usuario que está creando la casa.
 * @returns {Promise<House>} - Una promesa que resuelve con el objeto de la casa creada.
 * @throws {Error} - Si ocurre un error al crear la casa.
 */
exports.createHouse = async (name, location, description, userId) => {
  logger.info('service.js | Entrando en la función createHouse()');

  try {
    // Crear una nueva instancia de House con los datos proporcionados
    const house = new House({ name, location, description });

    // Guardar la nueva casa en la base de datos
    const savedHouse = await house.save();

    // Actualizar el array de houses del usuario con la nueva casa
    await User.findByIdAndUpdate(userId, { $push: { houses: savedHouse._id } }, { new: true, useFindAndModify: false });

    logger.info(`service.js | Casa con nombre ${name} creada y añadida al usuario con ID ${userId}`);
    return savedHouse;
  } catch (error) {
    logger.error(`service.js | Error al crear casa con nombre ${name}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw new Error('Error creating house');
  }
};

/**
 * Obtiene todas las casas.
 *
 * @returns {Promise<Array<House>>} - Una promesa que resuelve con un array de objetos de casas.
 * @throws {Error} - Si ocurre un error al recuperar las casas.
 */
exports.getAllHouses = async () => {
  logger.info('service.js | Entrando en la función getAllHouses()');

  try {
    // Recuperar todas las casas de la base de datos
    const houses = await House.find();

    logger.info('service.js | Recuperadas todas las casas con éxito');
    return houses;
  } catch (error) {
    logger.error('service.js | Error al recuperar las casas');
    logger.debug(`service.js | Error: ${error.message}`);
    throw new Error('Error retrieving houses');
  }
};

/**
 * Obtiene una casa por su ID.
 *
 * @param {string} id - El ID de la casa a recuperar.
 * @returns {Promise<House>} - Una promesa que resuelve con el objeto de la casa encontrada.
 * @throws {Error} - Si la casa no se encuentra o si ocurre un error al recuperarla.
 */
exports.getHouseById = async id => {
  logger.info(`service.js | Entrando en la función getHouseById() con ID: ${id}`);

  try {
    // Buscar la casa por ID en la base de datos
    const house = await House.findById(id);

    if (!house) {
      logger.warn(`service.js | Casa con ID ${id} no encontrada`);
      throw new Error('House not found');
    }

    logger.info(`service.js | Casa con ID ${id} recuperada con éxito`);
    return house;
  } catch (error) {
    logger.error(`service.js | Error al recuperar casa con ID ${id}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};

/**
 * Actualiza una casa por su ID.
 *
 * @param {string} id - El ID de la casa a actualizar.
 * @param {Object} updates - Los datos de actualización para la casa.
 * @returns {Promise<House>} - Una promesa que resuelve con el objeto de la casa actualizada.
 * @throws {Error} - Si la casa no se encuentra o si ocurre un error al actualizarla.
 */
exports.updateHouse = async (id, updates) => {
  logger.info(`service.js | Entrando en la función updateHouse() con ID: ${id}`);

  try {
    // Actualizar la casa por ID en la base de datos
    const house = await House.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!house) {
      logger.warn(`service.js | Casa con ID ${id} no encontrada para actualizar`);
      throw new Error('House not found');
    }

    logger.info(`service.js | Casa con ID ${id} actualizada con éxito`);
    return house;
  } catch (error) {
    logger.error(`service.js | Error al actualizar casa con ID ${id}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};

/**
 * Elimina una casa por su ID.
 *
 * @param {string} id - El ID de la casa a eliminar.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la casa ha sido eliminada.
 * @throws {Error} - Si la casa no se encuentra o si ocurre un error al eliminarla.
 */
exports.deleteHouse = async id => {
  logger.info(`service.js | Entrando en la función deleteHouse() con ID: ${id}`);

  try {
    // Eliminar la casa por ID en la base de datos
    const house = await House.findByIdAndDelete(id);

    if (!house) {
      logger.warn(`service.js | Casa con ID ${id} no encontrada para eliminar`);
      throw new Error('House not found');
    }

    // También deberíamos eliminar la casa de la lista de casas del usuario
    await User.updateMany({ houses: id }, { $pull: { houses: id } });

    logger.info(`service.js | Casa con ID ${id} eliminada con éxito`);
  } catch (error) {
    logger.error(`service.js | Error al eliminar casa con ID ${id}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};
