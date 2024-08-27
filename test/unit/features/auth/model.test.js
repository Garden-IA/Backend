const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../../src/features/auth/model');

describe('User Model', () => {
  it('should create a user with required fields', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.password).toBe('password123');
    expect(savedUser.email).toBe('test@example.com');
    expect(savedUser.active).toBe(true); // Valor por defecto
    expect(savedUser.roles).toEqual(['user']); // Valor por defecto
  });

  it('should not allow duplicate email addresses', async () => {
    const user1 = new User({
      username: 'user1',
      password: 'password123',
      email: 'duplicate@example.com',
    });

    await user1.save();

    const user2 = new User({
      username: 'user2',
      password: 'password456',
      email: 'duplicate@example.com',
    });

    await expect(user2.save()).rejects.toThrow();
  });

  it('should handle optional fields correctly', async () => {
    const user = new User({
      username: 'optionaluser',
      password: 'password123',
      email: 'optional@example.com',
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'http://example.com/profile.jpg',
      bio: 'This is a bio.',
      phoneNumber: '1234567890',
    });

    const savedUser = await user.save();

    expect(savedUser.firstName).toBe(user.firstName);
    expect(savedUser.lastName).toBe(user.lastName);
    expect(savedUser.profilePicture).toBe(user.profilePicture);
    expect(savedUser.bio).toBe(user.bio);
    expect(savedUser.phoneNumber).toBe(user.phoneNumber);
  });
});
