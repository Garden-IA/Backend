const authService = require('./service');
const logger = require('../../config/logger');

exports.register = async (req, res) => {
  logger.info(`controller.js | Entrando en la función register()`);
  const { email, password } = req.body;

  logger.debug(`controller.js | Email: ${email}`);
  logger.debug(`controller.js | Password: ${password}`);

  try {
    await authService.register(email, password);
    logger.info(`controller.js | Usuario con email ${email} registrado con éxito`);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    logger.error(`controller.js | Usuario con email ${email} no registrado`);
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  logger.info(`controller.js | Entrando en la función login()`);
  const { email, password } = req.body;

  logger.debug(`controller.js | Email: ${email}`);
  logger.debug(`controller.js | Password: ${password}`);

  try {
    const result = await authService.login(email, password);
    logger.info(`controller.js | Login de ${email} realizado con éxito`);
    res.json(result);
  } catch (error) {
    logger.error(`controller.js | Login fallido`);
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  logger.info(`controller.js | Entrando en la función getProfile()`);
  try {
    const { id } = req.body; // Assuming user ID is added to req by authentication middleware
    logger.debug(`controller.js | User ID: ${id}`);
    const userProfile = await authService.getProfile(id);

    logger.debug(`controller.js | User ID: ${id}`);
    logger.debug(`controller.js | User profile: ${userProfile}`);

    res.json(userProfile);
  } catch (error) {
    logger.error(`controller.js | Obtención del perfil fallida`);
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  logger.info(`controller.js | Entrando en la función updateProfile()`);
  try {
    const { id } = req.body; // Suponiendo que el ID del usuario está en req.user después de la autenticación
    const updates = req.body;

    logger.debug(`controller.js | User ID: ${id}`);
    logger.debug(`controller.js | Actualizaciones: ${JSON.stringify(updates)}`);

    const updatedUser = await authService.updateProfile(id, updates);

    logger.info(`controller.js | Perfil del usuario con ID ${id} actualizado con éxito`);
    res.json(updatedUser);
  } catch (error) {
    logger.error(`controller.js | Actualización del perfil fallida`);
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};
