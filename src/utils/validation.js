/**
 * @module utils/validation
 * @description Definición de las funcionesde validación.
 */

const logger = require('../config/logger');

/**
 * Valida la entrada para el registro de un usuario.
 *
 * Esta función verifica que se hayan proporcionado un nombre de usuario y una contraseña.
 * Si faltan alguno de estos campos, se devuelve un objeto de errores.
 *
 * @param {Object} data - Los datos de entrada para la validación.
 * @param {string} data.username - El nombre de usuario proporcionado para el registro.
 * @param {string} data.password - La contraseña proporcionada para el registro.
 * @returns {Object} Un objeto que contiene:
 *   - {Object} errors - Un objeto con mensajes de error si hay campos faltantes.
 *   - {boolean} isValid - Un valor booleano que indica si la entrada es válida o no.
 */
exports.validateRegisterInput = data => {
  logger.debug(`validation.js | Entrando en la función validateRegisterInput()`);

  const { username, password } = data;
  let errors = {};

  // Verificar si el nombre de usuario y la contraseña están presentes
  if (!username || !password) {
    errors = { ...errors, message: 'Username and password are required' };
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
