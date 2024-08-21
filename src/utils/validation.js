// Ejemplo de función de validación simple
exports.validateRegisterInput = data => {
  logger.debug(`validation.js | Entrando en la función validateRegisterInput()`);
  const { username, password } = data;
  let errors = {};

  if (!username || !password) {
    errors = { ...errors, message: 'Username and password are required' };
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
