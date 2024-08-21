const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/authConfig');
const logger = require('../../config/logger');

exports.register = async (email, password) => {
  logger.info(`service.js | Entrando en la función register()`);

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

exports.login = async (email, password) => {
  logger.info(`service.js | Entrando en la función login()`);

  // Buscar al usuario por email
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Comparar la contraseña proporcionada con la almacenada
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  // Crear un token JWT
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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

exports.updateProfile = async (userId, updates) => {
  logger.info(`service.js | Entrando en la función updateProfile() con userId: ${userId}`);

  // Actualizar el usuario por ID
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) throw new Error('User not found');

  return user;
};
