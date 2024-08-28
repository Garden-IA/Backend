const logger = require('../config/logger');

/**
 * Middleware para registrar información relevante de una solicitud HTTP.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 */
exports.logRequest = (req, res, next) => {
  logger.debug('loggerMiddleware.js | Entrando en la función logRequest()');
  const { method, url, headers, body, query, params } = req;

  // Información básica de la solicitud
  const logMessage = `
        Method: ${method}
        URL: ${url}
        Headers: ${JSON.stringify(headers)}
        Query: ${JSON.stringify(query)}
        Params: ${JSON.stringify(params)}
        Body: ${JSON.stringify(body)}
    `;

  // Loggeamos la información
  logger.debug(`loggerMiddleware.js | Method: ${method}`);
  logger.debug(`loggerMiddleware.js | URL: ${url}`);
  logger.debug(`loggerMiddleware.js | Headers: ${JSON.stringify(headers)}`);
  logger.debug(`loggerMiddleware.js | Query: ${JSON.stringify(query)}`);
  logger.debug(`loggerMiddleware.js | Params: ${JSON.stringify(params)}`);
  logger.debug(`loggerMiddleware.js | Body: ${JSON.stringify(body)}`);

  // Pasamos al siguiente middleware
  next();
};
