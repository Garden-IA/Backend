const jwt = require('jsonwebtoken');
const { verifyToken } = require('../../../src/middleware/auth');
const { JWT_SECRET } = require('../../../src/config/authConfig');
const logger = require('../../../src/config/logger');

// Mock del logger y jwt
jest.mock('jsonwebtoken');
jest.mock('../../../src/config/logger');

describe('verifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  it('should return 401 if no authorization header is provided', () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No header provided' });
    expect(logger.warn).toHaveBeenCalledWith('auth.js | No header provided');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    req.headers['authorization'] = 'Bearer ';

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(logger.warn).toHaveBeenCalledWith('auth.js | No token provided');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token verification fails', () => {
    req.headers['authorization'] = 'Bearer invalidtoken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Failed to authenticate token'), null);
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to authenticate token' });
    expect(logger.warn).toHaveBeenCalledWith('auth.js | Failed to authenticate token');
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and set req.user if token is valid', () => {
    const decoded = { id: 1, username: 'testuser' };
    req.headers['authorization'] = 'Bearer validtoken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    verifyToken(req, res, next);

    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
