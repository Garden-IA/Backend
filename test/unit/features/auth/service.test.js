const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../../src/features/auth/model');
const authService = require('../../../../src/features/auth/service');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../../../src/config/authConfig');
const logger = require('../../../../src/config/logger');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../../src/features/auth/model');
jest.mock('../../../../src/config/logger');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      User.findOne.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.prototype.save.mockResolvedValue({ email, password: hashedPassword });

      const user = await authService.register(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(user.email).toBe(email);
    });

    it('should throw an error if user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      User.findOne.mockResolvedValue({ email });

      await expect(authService.register(email, password)).rejects.toThrow('User already exists with this email');
    });
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';
      const token = 'jwt.token.here';
      const user = { _id: 'userId', email, password: hashedPassword, lastLogin: null };

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);
      User.prototype.save.mockResolvedValue({ ...user, lastLogin: Date.now() });

      const result = await authService.login(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      expect(result.token).toBe(token);
    });

    it('should throw an error if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      User.findOne.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow('User not found');
    });

    it('should throw an error if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';
      const user = { _id: 'userId', email, password: hashedPassword };

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfile', () => {
    it('should return the user profile successfully', async () => {
      const userId = 'userId';
      const user = { _id: userId, email: 'test@example.com' };

      User.findById.mockResolvedValue(user);

      const result = await authService.getProfile(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 'userId';

      User.findById.mockResolvedValue(null);

      await expect(authService.getProfile(userId)).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile successfully', async () => {
      const userId = 'userId';
      const updates = { email: 'new@example.com' };
      const updatedUser = { _id: userId, email: 'new@example.com' };

      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await authService.updateProfile(userId, updates);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, updates, { new: true });
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 'userId';
      const updates = { email: 'new@example.com' };

      User.findByIdAndUpdate.mockResolvedValue(null);

      await expect(authService.updateProfile(userId, updates)).rejects.toThrow('User not found');
    });
  });
});
