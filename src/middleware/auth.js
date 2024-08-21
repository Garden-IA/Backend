const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/authConfig');
const logger = require('../config/logger');

exports.verifyToken = (req, res, next) => {
  logger.info(`auth.js | Entrando en la función verifyToken()`);

  // Obtener el token del encabezado 'Authorization'
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No header provided' });
  }

  // Extraer el token del formato 'Bearer token'
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verificar el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Añadir la información del usuario al objeto de solicitud
    req.user = decoded;
    next();
  });
};
