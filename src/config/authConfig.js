/**
 * @module config/authConfig
 * @description Configuración para la autenticación basada en JWT (JSON Web Token).
 * Este módulo exporta las configuraciones necesarias para manejar tokens JWT, incluyendo el secreto y el tiempo de expiración.
 */

module.exports = {
  /**
   * Clave secreta utilizada para firmar los tokens JWT.
   * Se toma del entorno de variables (process.env.JWT_SECRET) o se usa un valor predeterminado si no está definida.
   * @type {string}
   * @default 'your_jwt_secret'
   */
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',

  /**
   * Tiempo de expiración de los tokens JWT.
   * Este valor define cuánto tiempo es válido un token antes de que expire.
   * @type {string}
   * @default '1h' (1 hora)
   */
  JWT_EXPIRES_IN: '1h',
};
