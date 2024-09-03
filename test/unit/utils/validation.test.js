const { validateRegisterInput } = require('../../../src/utils/validation');
const logger = require('../../../src/config/logger');

// Mock del logger
jest.mock('../../../src/config/logger');

describe('validateRegisterInput', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  it('should return valid if both username and password are provided', () => {
    const inputData = {
      username: 'testuser',
      password: 'testpassword',
    };

    const result = validateRegisterInput(inputData);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(logger.debug).toHaveBeenCalledWith('validation.js | Entrando en la función validateRegisterInput()');
  });

  it('should return invalid if username is missing', () => {
    const inputData = {
      password: 'testpassword',
    };

    const result = validateRegisterInput(inputData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({ message: 'Username and password are required' });
    expect(logger.debug).toHaveBeenCalledWith('validation.js | Entrando en la función validateRegisterInput()');
  });

  it('should return invalid if password is missing', () => {
    const inputData = {
      username: 'testuser',
    };

    const result = validateRegisterInput(inputData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({ message: 'Username and password are required' });
    expect(logger.debug).toHaveBeenCalledWith('validation.js | Entrando en la función validateRegisterInput()');
  });

  it('should return invalid if both username and password are missing', () => {
    const inputData = {};

    const result = validateRegisterInput(inputData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({ message: 'Username and password are required' });
    expect(logger.debug).toHaveBeenCalledWith('validation.js | Entrando en la función validateRegisterInput()');
  });
});
