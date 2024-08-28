const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../../src/features/auth/model');
const House = require('../../../../src/features/house/model');

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

  it('should add and retrieve houses correctly', async () => {
    // Primero, crea y guarda una casa
    const house = new House({
      name: 'Beach House',
      location: 'California',
      description: 'A beautiful beach house.',
    });

    const savedHouse = await house.save();

    // Luego, crea un usuario y asocia la casa
    const user = new User({
      username: 'houseuser',
      password: 'password123',
      email: 'houseuser@example.com',
      houses: [savedHouse._id], // Asocia la casa al usuario
    });

    const savedUser = await user.save();

    // Verifica que la casa se ha asociado al usuario
    expect(savedUser.houses).toContain(savedHouse._id);

    // Carga el usuario desde la base de datos e incluye las casas pobladas
    const populatedUser = await User.findById(savedUser._id).populate('houses').exec();

    expect(populatedUser.houses.length).toBe(1);
    expect(populatedUser.houses[0].name).toBe('Beach House');
    expect(populatedUser.houses[0].location).toBe('California');
  });
});
