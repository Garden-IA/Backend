/**
 * @module features/auth/service
 * @description Definición de los servicios de autenticación.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model');
const tokenManager = require('../../utils/tokenManager');
const logger = require('../../config/logger');

/**
 * Registra un nuevo usuario.
 *
 * @param {string} email - El correo electrónico del nuevo usuario.
 * @param {string} password - La contraseña del nuevo usuario.
 * @returns {Promise<User>} - Una promesa que resuelve con el nuevo usuario registrado.
 * @throws {Error} - Si ya existe un usuario con el correo electrónico proporcionado.
 */
exports.register = async (email, password) => {
  logger.info('service.js | Entrando en la función register()');

  // Verificar si ya existe un usuario con este email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear un nuevo usuario
  const newUser = new User({ email, password: hashedPassword });

  // Guardar el usuario en la base de datos
  return newUser.save();
};

/**
 * Inicia sesión de un usuario y genera un token JWT.
 *
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<Object>} - Una promesa que resuelve con un objeto que contiene los detalles del usuario y el token JWT.
 * @throws {Error} - Si el usuario no se encuentra o las credenciales son inválidas.
 */
exports.login = async (email, password) => {
  logger.info('service.js | Entrando en la función login()');

  // Buscar al usuario por email
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Comparar la contraseña proporcionada con la almacenada
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  // Crear un token JWT
  const token = tokenManager.generateToken(user);
  logger.debug(`service.js | Token para el usuario ${email}: ${token}`);

  // Actualizar el campo 'lastLogin' con la fecha y hora actual
  user.lastLogin = Date.now();
  await user.save();

  // Devolver los detalles del usuario junto con el token
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    lastLogin: user.lastLogin, // Incluir el campo 'lastLogin' en la respuesta
    token: token,
  };
};

/**
 * Obtiene el perfil de un usuario por su ID.
 *
 * @param {string} id - El ID del usuario.
 * @returns {Promise<User>} - Una promesa que resuelve con el documento del usuario.
 * @throws {Error} - Si el usuario no se encuentra.
 */
exports.getProfile = async id => {
  logger.info(`service.js | Entrando en la función getProfile() con id: ${id}`);

  // Buscar el usuario por id
  const user = await User.findById(id);

  if (!user) {
    logger.warn(`service.js | Usuario con id ${id} no encontrado`);
    throw new Error('User not found');
  }

  return user;
};

/**
 * Actualiza el perfil de un usuario por su ID.
 *
 * @param {string} userId - El ID del usuario a actualizar.
 * @param {Object} updates - Un objeto que contiene los campos a actualizar.
 * @returns {Promise<User>} - Una promesa que resuelve con el usuario actualizado.
 * @throws {Error} - Si el usuario no se encuentra.
 */
exports.updateProfile = async (userId, updates) => {
  logger.info(`service.js | Entrando en la función updateProfile() con userId: ${userId}`);

  // Actualizar el usuario por ID
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) throw new Error('User not found');

  return user;
};
