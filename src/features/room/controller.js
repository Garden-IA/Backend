const roomService = require('./service');
const logger = require('../../config/logger');

/**
 * Crea una nueva habitación.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.body - El cuerpo de la solicitud, que debe contener los detalles de la habitación.
 * @param {string} req.body.name - El nombre de la habitación.
 * @param {string} req.body.type - El tipo de habitación (e.g., dormitorio, sala de estar).
 * @param {string} req.body.humidity - El nivel de humedad en la habitación ('low', 'medium', 'high').
 * @param {boolean} req.body.airConditioner - Indica si hay aire acondicionado en la habitación.
 * @param {boolean} req.body.radiator - Indica si hay radiador en la habitación.
 * @param {string} req.body.light - El nivel de luz en la habitación ('low', 'medium', 'high').
 * @param {string} req.body.houseId - El ID de la casa a la que pertenece la habitación.
 * @param {Array<string>} req.body.plants - Array de IDs de plantas en la habitación.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.createRoom = async (req, res) => {
  logger.info('controller.js | Entrando en la función createRoom()');

  if (!req.body) {
    logger.warn('controller.js | El cuerpo de la solicitud está vacío');
    return res.status(400).json({ message: 'Request body is missing' });
  }

  const { name, type, humidity, airConditioner, radiator, light, houseId, plants } = req.body;

  if (!name || !type || !houseId) {
    logger.warn('controller.js | Campos requeridos están vacíos');
    return res.status(400).json({ message: 'Name, type, and house ID are required' });
  }

  logger.debug(`controller.js | Nombre de la habitación: ${name}`);
  logger.debug(`controller.js | Tipo de habitación: ${type}`);
  logger.debug(`controller.js | Humedad: ${humidity}`);
  logger.debug(`controller.js | Aire acondicionado: ${airConditioner}`);
  logger.debug(`controller.js | Radiador: ${radiator}`);
  logger.debug(`controller.js | Luz: ${light}`);
  logger.debug(`controller.js | ID de la casa: ${houseId}`);
  logger.debug(`controller.js | Plantas: ${plants || 'No proporcionadas'}`);

  try {
    // Llamada al servicio para crear la habitación
    const room = await roomService.createRoom(name, type, humidity, airConditioner, radiator, light, houseId, plants);

    logger.info(`controller.js | Habitación con nombre ${name} creada con éxito`);
    res.status(201).json({ id: room._id, message: 'Room created successfully' });
  } catch (error) {
    logger.error(`controller.js | Error al crear habitación con nombre ${name}`);
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Obtiene todas las habitaciones.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.getAllRooms = async (req, res) => {
  logger.info('controller.js | Entrando en la función getAllRooms()');

  try {
    const rooms = await roomService.getAllRooms();
    logger.info('controller.js | Recuperadas todas las habitaciones con éxito');
    res.status(200).json(rooms);
  } catch (error) {
    logger.error('controller.js | Error al recuperar las habitaciones');
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Obtiene una habitación por su ID.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.params - Los parámetros de la solicitud, que deben incluir el ID de la habitación.
 * @param {string} req.params.id - El ID de la habitación a recuperar.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.getRoomById = async (req, res) => {
  logger.info('controller.js | Entrando en la función getRoomById()');

  const roomId = req.params.id;

  if (!roomId) {
    logger.warn('controller.js | ID de la habitación no proporcionado');
    return res.status(400).json({ message: 'Room ID is required' });
  }

  logger.debug(`controller.js | ID de la habitación a recuperar: ${roomId}`);

  try {
    const room = await roomService.getRoomById(roomId);
    logger.info(`controller.js | Habitación con ID ${roomId} recuperada con éxito`);
    res.status(200).json(room);
  } catch (error) {
    if (error.message === 'Room not found') {
      logger.warn(`controller.js | Habitación con ID ${roomId} no encontrada`);
      res.status(404).json({ message: 'Room not found' });
    } else {
      logger.error(`controller.js | Error al recuperar habitación con ID ${roomId}`);
      logger.debug(`controller.js | Error: ${error.message}`);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

/**
 * Actualiza una habitación por su ID.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.params - Los parámetros de la solicitud, que deben incluir el ID de la habitación.
 * @param {string} req.params.id - El ID de la habitación a actualizar.
 * @param {Object} req.body - El cuerpo de la solicitud, que debe contener los campos a actualizar.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.updateRoom = async (req, res) => {
  logger.info('controller.js | Entrando en la función updateRoom()');

  const roomId = req.params.id;

  if (!roomId) {
    logger.warn('controller.js | ID de la habitación no proporcionado');
    return res.status(400).json({ message: 'Room ID is required' });
  }

  if (!req.body) {
    logger.warn('controller.js | El cuerpo de la solicitud está vacío');
    return res.status(400).json({ message: 'Request body is missing' });
  }

  logger.debug(`controller.js | ID de la habitación a actualizar: ${roomId}`);
  logger.debug(`controller.js | Datos de actualización: ${JSON.stringify(req.body)}`);

  try {
    const updatedRoom = await roomService.updateRoom(roomId, req.body);
    logger.info(`controller.js | Habitación con ID ${roomId} actualizada con éxito`);
    res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
  } catch (error) {
    if (error.message === 'Room not found') {
      logger.warn(`controller.js | Habitación con ID ${roomId} no encontrada para actualizar`);
      res.status(404).json({ message: 'Room not found' });
    } else {
      logger.error(`controller.js | Error al actualizar habitación con ID ${roomId}`);
      logger.debug(`controller.js | Error: ${error.message}`);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

/**
 * Elimina una habitación por su ID.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.params - Los parámetros de la solicitud, que deben incluir el ID de la habitación.
 * @param {string} req.params.id - El ID de la habitación a eliminar.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.deleteRoom = async (req, res) => {
  logger.info('controller.js | Entrando en la función deleteRoom()');

  const roomId = req.params.id;

  if (!roomId) {
    logger.warn('controller.js | ID de la habitación no proporcionado');
    return res.status(400).json({ message: 'Room ID is required' });
  }

  logger.debug(`controller.js | ID de la habitación a eliminar: ${roomId}`);

  try {
    await roomService.deleteRoom(roomId);
    logger.info(`controller.js | Habitación con ID ${roomId} eliminada con éxito`);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    if (error.message === 'Room not found') {
      logger.warn(`controller.js | Habitación con ID ${roomId} no encontrada para eliminar`);
      res.status(404).json({ message: 'Room not found' });
    } else {
      logger.error(`controller.js | Error al eliminar habitación con ID ${roomId}`);
      logger.debug(`controller.js | Error: ${error.message}`);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};
