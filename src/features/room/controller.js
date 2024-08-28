const houseService = require('./service');
const logger = require('../../config/logger');

/**
 * Crea una nueva casa.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.body - El cuerpo de la solicitud, que debe contener los detalles de la casa.
 * @param {string} req.body.name - El nombre de la casa.
 * @param {string} req.body.location - La ubicación de la casa.
 * @param {string} [req.body.description] - La descripción de la casa (opcional).
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.createHouse = async (req, res) => {
  logger.info('controller.js | Entrando en la función createHouse()');

  if (!req.body) {
    logger.warn('controller.js | El cuerpo de la solicitud está vacío');
    return res.status(400).json({ message: 'Request body is missing' });
  }

  const { name, location, description } = req.body;
  const userId = req.userId; // Suponiendo que el ID del usuario está disponible en req.userId

  if (!name || !location) {
    logger.warn('controller.js | Campos requeridos están vacíos');
    return res.status(400).json({ message: 'Name and location are required' });
  }

  logger.debug(`controller.js | Nombre de la casa: ${name}`);
  logger.debug(`controller.js | Ubicación de la casa: ${location}`);
  logger.debug(`controller.js | Descripción de la casa: ${description || 'No proporcionada'}`);
  logger.debug(`controller.js | ID del usuario: ${userId}`);

  try {
    // Asegúrate de que el userId esté disponible y sea válido antes de llamar al servicio
    if (!userId) {
      logger.warn('controller.js | ID del usuario no proporcionado');
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Llamada al servicio para crear la casa
    const house = await houseService.createHouse(name, location, description, userId);

    logger.info(`controller.js | Casa con nombre ${name} creada con éxito`);
    res.status(201).json({ id: house._id, message: 'House created successfully' });
  } catch (error) {
    logger.error(`controller.js | Error al crear casa con nombre ${name}`);
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Obtiene todas las casas.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.getAllHouses = async (req, res) => {
  logger.info('controller.js | Entrando en la función getAllHouses()');

  try {
    const houses = await houseService.getAllHouses();
    logger.info('controller.js | Recuperadas todas las casas con éxito');
    res.status(200).json(houses);
  } catch (error) {
    logger.error('controller.js | Error al recuperar las casas');
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Obtiene una casa por su ID.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.params - Los parámetros de la solicitud, que deben incluir el ID de la casa.
 * @param {string} req.params.id - El ID de la casa a recuperar.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.getHouseById = async (req, res) => {
  logger.info('controller.js | Entrando en la función getHouseById()');

  const houseId = req.params.id;

  if (!houseId) {
    logger.warn('controller.js | ID de la casa no proporcionado');
    return res.status(400).json({ message: 'House ID is required' });
  }

  logger.debug(`controller.js | ID de la casa a recuperar: ${houseId}`);

  try {
    const house = await houseService.getHouseById(houseId);
    logger.info(`controller.js | Casa con ID ${houseId} recuperada con éxito`);
    res.status(200).json(house);
  } catch (error) {
    if (error.message === 'House not found') {
      logger.warn(`controller.js | Casa con ID ${houseId} no encontrada`);
      res.status(404).json({ message: 'House not found' });
    } else {
      logger.error(`controller.js | Error al recuperar casa con ID ${houseId}`);
      logger.debug(`controller.js | Error: ${error.message}`);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

/**
 * Actualiza una casa por su ID.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.params - Los parámetros de la solicitud, que deben incluir el ID de la casa.
 * @param {string} req.params.id - El ID de la casa a actualizar.
 * @param {Object} req.body - El cuerpo de la solicitud, que debe contener los campos a actualizar.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.updateHouse = async (req, res) => {
  logger.info('controller.js | Entrando en la función updateHouse()');

  const houseId = req.params.id;

  if (!houseId) {
    logger.warn('controller.js | ID de la casa no proporcionado');
    return res.status(400).json({ message: 'House ID is required' });
  }

  if (!req.body) {
    logger.warn('controller.js | El cuerpo de la solicitud está vacío');
    return res.status(400).json({ message: 'Request body is missing' });
  }

  logger.debug(`controller.js | ID de la casa a actualizar: ${houseId}`);
  logger.debug(`controller.js | Datos de actualización: ${JSON.stringify(req.body)}`);

  try {
    const updatedHouse = await houseService.updateHouse(houseId, req.body);
    logger.info(`controller.js | Casa con ID ${houseId} actualizada con éxito`);
    res.status(200).json({ message: 'House updated successfully', house: updatedHouse });
  } catch (error) {
    if (error.message === 'House not found') {
      logger.warn(`controller.js | Casa con ID ${houseId} no encontrada para actualizar`);
      res.status(404).json({ message: 'House not found' });
    } else {
      logger.error(`controller.js | Error al actualizar casa con ID ${houseId}`);
      logger.debug(`controller.js | Error: ${error.message}`);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

/**
 * Elimina una casa por su ID.
 *
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} req.params - Los parámetros de la solicitud, que deben incluir el ID de la casa.
 * @param {string} req.params.id - El ID de la casa a eliminar.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.deleteHouse = async (req, res) => {
  logger.info('controller.js | Entrando en la función deleteHouse()');

  const houseId = req.params.id;

  if (!houseId) {
    logger.warn('controller.js | ID de la casa no proporcionado');
    return res.status(400).json({ message: 'House ID is required' });
  }

  logger.debug(`controller.js | ID de la casa a eliminar: ${houseId}`);

  try {
    await houseService.deleteHouse(houseId);
    logger.info(`controller.js | Casa con ID ${houseId} eliminada con éxito`);
    res.status(200).json({ message: 'House deleted successfully' });
  } catch (error) {
    if (error.message === 'House not found') {
      logger.warn(`controller.js | Casa con ID ${houseId} no encontrada para eliminar`);
      res.status(404).json({ message: 'House not found' });
    } else {
      logger.error(`controller.js | Error al eliminar casa con ID ${houseId}`);
      logger.debug(`controller.js | Error: ${error.message}`);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};
