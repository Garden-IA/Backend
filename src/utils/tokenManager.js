const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/authConfig');

/**
 * Genera un JWT para un usuario.
 *
 * @param {Object} user - El objeto del usuario.
 * @returns {string} - El token JWT.
 */
exports.generateToken = user => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
