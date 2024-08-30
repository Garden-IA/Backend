/**
 * @module middleware/auth
 * @description Definición de las funciones para la autenticación de usuarios.
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/authConfig');
const logger = require('../config/logger');

/**
 * Middleware para verificar el token JWT en las solicitudes.
 *
 * Este middleware extrae el token del encabezado 'Authorization', verifica su validez
 * y añade la información del usuario decodificada al objeto de solicitud (`req.user`).
 *
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @param {Function} next - La función que se llama para pasar al siguiente middleware.
 * @returns {void}
 */
exports.verifyToken = (req, res, next) => {
  logger.info(`auth.js | Entrando en la función verifyToken()`);

  // Obtener el token del encabezado 'Authorization'
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    logger.warn('auth.js | No header provided');
    return res.status(401).json({ error: 'No header provided' });
  }

  // Extraer el token del formato 'Bearer token'
  const token = authHeader.split(' ')[1];

  if (!token) {
    logger.warn('auth.js | No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verificar el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn('auth.js | Failed to authenticate token');
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Añadir la información del usuario al objeto de solicitud
    req.user = decoded;
    req.userId = decoded.id;
    logger.info(`auth.js | Token validado, usuarioID: ${req.userId}`);

    next();
  });
};
