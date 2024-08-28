const Room = require('./model'); // Ajusta la ruta según la ubicación del modelo
const House = require('../house/model'); // Ajusta la ruta según la ubicación del modelo
const logger = require('../../config/logger');

/**
 * Crea una nueva habitación y la asocia a la casa especificada.
 *
 * @param {string} name - El nombre de la habitación.
 * @param {string} type - El tipo de habitación (e.g., dormitorio, sala de estar).
 * @param {string} humidity - El nivel de humedad en la habitación ('low', 'medium', 'high').
 * @param {boolean} airConditioner - Indica si hay aire acondicionado en la habitación.
 * @param {boolean} radiator - Indica si hay radiador en la habitación.
 * @param {string} light - El nivel de luz en la habitación ('low', 'medium', 'high').
 * @param {string} houseId - El ID de la casa a la que pertenece la habitación.
 * @param {Array<string>} plants - Array de IDs de plantas en la habitación.
 * @returns {Promise<Room>} - Una promesa que resuelve con el objeto de la habitación creada.
 * @throws {Error} - Si ocurre un error al crear la habitación.
 */
exports.createRoom = async (name, type, humidity, airConditioner, radiator, light, houseId, plants) => {
  logger.info('service.js | Entrando en la función createRoom()');

  try {
    // Crear una nueva instancia de Room con los datos proporcionados
    const room = new Room({ name, type, humidity, airConditioner, radiator, light, plants });

    // Guardar la nueva habitación en la base de datos
    const savedRoom = await room.save();

    // Actualizar el array de rooms de la casa con la nueva habitación
    await House.findByIdAndUpdate(houseId, { $push: { rooms: savedRoom._id } }, { new: true, useFindAndModify: false });

    logger.info(`service.js | Habitación con nombre ${name} creada y añadida a la casa con ID ${houseId}`);
    return savedRoom;
  } catch (error) {
    logger.error(`service.js | Error al crear habitación con nombre ${name}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw new Error('Error creating room');
  }
};

/**
 * Obtiene todas las habitaciones.
 *
 * @returns {Promise<Array<Room>>} - Una promesa que resuelve con un array de objetos de habitaciones.
 * @throws {Error} - Si ocurre un error al recuperar las habitaciones.
 */
exports.getAllRooms = async () => {
  logger.info('service.js | Entrando en la función getAllRooms()');

  try {
    // Recuperar todas las habitaciones de la base de datos
    const rooms = await Room.find();

    logger.info('service.js | Recuperadas todas las habitaciones con éxito');
    return rooms;
  } catch (error) {
    logger.error('service.js | Error al recuperar las habitaciones');
    logger.debug(`service.js | Error: ${error.message}`);
    throw new Error('Error retrieving rooms');
  }
};

/**
 * Obtiene una habitación por su ID.
 *
 * @param {string} id - El ID de la habitación a recuperar.
 * @returns {Promise<Room>} - Una promesa que resuelve con el objeto de la habitación encontrada.
 * @throws {Error} - Si la habitación no se encuentra o si ocurre un error al recuperarla.
 */
exports.getRoomById = async id => {
  logger.info(`service.js | Entrando en la función getRoomById() con ID: ${id}`);

  try {
    // Buscar la habitación por ID en la base de datos
    const room = await Room.findById(id);

    if (!room) {
      logger.warn(`service.js | Habitación con ID ${id} no encontrada`);
      throw new Error('Room not found');
    }

    logger.info(`service.js | Habitación con ID ${id} recuperada con éxito`);
    return room;
  } catch (error) {
    logger.error(`service.js | Error al recuperar habitación con ID ${id}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};

/**
 * Actualiza una habitación por su ID.
 *
 * @param {string} id - El ID de la habitación a actualizar.
 * @param {Object} updates - Los datos de actualización para la habitación.
 * @returns {Promise<Room>} - Una promesa que resuelve con el objeto de la habitación actualizada.
 * @throws {Error} - Si la habitación no se encuentra o si ocurre un error al actualizarla.
 */
exports.updateRoom = async (id, updates) => {
  logger.info(`service.js | Entrando en la función updateRoom() con ID: ${id}`);

  try {
    // Actualizar la habitación por ID en la base de datos
    const room = await Room.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!room) {
      logger.warn(`service.js | Habitación con ID ${id} no encontrada para actualizar`);
      throw new Error('Room not found');
    }

    logger.info(`service.js | Habitación con ID ${id} actualizada con éxito`);
    return room;
  } catch (error) {
    logger.error(`service.js | Error al actualizar habitación con ID ${id}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};

/**
 * Elimina una habitación por su ID.
 *
 * @param {string} id - El ID de la habitación a eliminar.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la habitación ha sido eliminada.
 * @throws {Error} - Si la habitación no se encuentra o si ocurre un error al eliminarla.
 */
exports.deleteRoom = async id => {
  logger.info(`service.js | Entrando en la función deleteRoom() con ID: ${id}`);

  try {
    // Eliminar la habitación por ID en la base de datos
    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      logger.warn(`service.js | Habitación con ID ${id} no encontrada para eliminar`);
      throw new Error('Room not found');
    }

    // También deberíamos eliminar la habitación de la lista de habitaciones en la casa
    await House.updateMany({ rooms: id }, { $pull: { rooms: id } });

    logger.info(`service.js | Habitación con ID ${id} eliminada con éxito`);
  } catch (error) {
    logger.error(`service.js | Error al eliminar habitación con ID ${id}`);
    logger.debug(`service.js | Error: ${error.message}`);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};
