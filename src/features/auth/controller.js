/**
 * @module features/auth/controller
 * @description Controlador para la gestión de autenticación de usuarios.
 * Este módulo maneja las solicitudes relacionadas con el registro, inicio de sesión, obtención y actualización del perfil de usuario.
 */

const authService = require('./service');
const logger = require('../../config/logger');

/**
 * Maneja la solicitud para registrar un nuevo usuario.
 *
 * @function register
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.register = async (req, res) => {
  logger.info('controller.js | Entrando en la función register()');
  const { email, password } = req.body;

  logger.debug(`controller.js | Email: ${email}`);
  logger.debug(`controller.js | Contraseña: ${password}`);

  try {
    await authService.register(email, password);
    logger.info(`controller.js | Usuario con email ${email} registrado con éxito`);
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    logger.error(`controller.js | Error al registrar usuario con email ${email}`);
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Maneja la solicitud para iniciar sesión de un usuario.
 *
 * @function login
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.login = async (req, res) => {
  logger.info('controller.js | Entrando en la función login()');
  const { email, password } = req.body;

  logger.debug(`controller.js | Email: ${email}`);
  logger.debug(`controller.js | Contraseña: ${password}`);

  try {
    const result = await authService.login(email, password);
    logger.info(`controller.js | Usuario ${email} inició sesión con éxito`);
    res.json(result);
  } catch (error) {
    logger.error('controller.js | Error al iniciar sesión');
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Maneja la solicitud para obtener el perfil del usuario.
 *
 * @function getProfile
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.getProfile = async (req, res) => {
  logger.info('controller.js | Entrando en la función getProfile()');
  try {
    const { id } = req.body; // Suponiendo que el ID del usuario esté en req.body
    logger.debug(`controller.js | ID del usuario: ${id}`);

    const userProfile = await authService.getProfile(id);
    logger.info(`controller.js | Perfil del usuario con ID ${id} obtenido con éxito`);
    res.json(userProfile);
  } catch (error) {
    logger.error('controller.js | Error al obtener el perfil');
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

/**
 * Maneja la solicitud para actualizar el perfil del usuario.
 *
 * @function updateProfile
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @returns {void}
 */
exports.updateProfile = async (req, res) => {
  logger.info('controller.js | Entrando en la función updateProfile()');
  try {
    const { id } = req.body; // Suponiendo que el ID del usuario esté en req.body
    const updates = req.body;

    logger.debug(`controller.js | ID del usuario: ${id}`);
    logger.debug(`controller.js | Actualizaciones: ${JSON.stringify(updates)}`);

    const updatedUser = await authService.updateProfile(id, updates);
    logger.info(`controller.js | Perfil del usuario con ID ${id} actualizado con éxito`);
    res.json(updatedUser);
  } catch (error) {
    logger.error('controller.js | Error al actualizar el perfil');
    logger.debug(`controller.js | Error: ${error.message}`);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
