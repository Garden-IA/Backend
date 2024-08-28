const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const houseService = require('../../../../src/features/house/service');
const houseController = require('../../../../src/features/house/controller');
const authMiddleware = require('../../../../src/middleware/auth');

// Crear una instancia de Express y configurar las rutas
const app = express();
app.use(express.json());

const mockId = new mongoose.Types.ObjectId();

// Simular el middleware de autenticación
app.use(authMiddleware.verifyToken, (req, res, next) => {
  req.userId = mockId; // Simular un ID de usuario
  next();
});

// Configurar las rutas
app.post('/api/v1/houses', houseController.createHouse);
app.get('/api/v1/houses', houseController.getAllHouses);
app.get('/api/v1/houses/:id', houseController.getHouseById);
app.put('/api/v1/houses/:id', houseController.updateHouse);
app.delete('/api/v1/houses/:id', houseController.deleteHouse);

describe('House Controller', () => {
  const mockId = mockId; // Ejemplo de ObjectId de MongoDB

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new house', async () => {
    const mockHouse = { _id: mockId, name: 'Beautiful House', location: 'New York', description: 'A beautiful house in New York' };

    jest.spyOn(houseService, 'createHouse').mockResolvedValue(mockHouse);

    const response = await request(app).post('/api/v1/houses').send({
      name: 'Beautiful House',
      location: 'New York',
      description: 'A beautiful house in New York',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('House created successfully');
    expect(response.body.id).toBe(mockId);
  });

  it('should return 400 if name or location is missing', async () => {
    const response = await request(app).post('/api/v1/houses').send({
      name: 'House Without Location',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name and location are required');
  });

  it('should get all houses', async () => {
    const mockHouses = [
      { _id: mockId, name: 'House 1', location: 'Location 1' },
      { _id: '60b8d6f7c9d3466a7a5f2b4b', name: 'House 2', location: 'Location 2' },
    ];

    jest.spyOn(houseService, 'getAllHouses').mockResolvedValue(mockHouses);

    const response = await request(app).get('/api/v1/houses');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]._id).toBe(mockId);
    expect(response.body[1]._id).toBe('60b8d6f7c9d3466a7a5f2b4b');
  });

  it('should get a house by ID', async () => {
    const mockHouse = { _id: mockId, name: 'Test House', location: 'Chicago' };

    jest.spyOn(houseService, 'getHouseById').mockResolvedValue(mockHouse);

    const response = await request(app).get(`/api/v1/houses/${mockId}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(mockId);
    expect(response.body.name).toBe('Test House');
    expect(response.body.location).toBe('Chicago');
  });

  it('should return 404 if house not found', async () => {
    jest.spyOn(houseService, 'getHouseById').mockRejectedValue(new Error('House not found'));

    const response = await request(app).get('/api/v1/houses/66ce0af55d90e92eb2fc4e1a');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('House not found');
  });

  it('should update a house by ID', async () => {
    const mockHouse = { _id: mockId, name: 'Updated House', location: 'San Francisco Updated' };

    jest.spyOn(houseService, 'updateHouse').mockResolvedValue(mockHouse);

    const response = await request(app).put(`/api/v1/houses/${mockId}`).send({
      name: 'Updated House',
      location: 'San Francisco Updated',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('House updated successfully');
    expect(response.body.house._id).toBe(mockId);
    expect(response.body.house.name).toBe('Updated House');
  });

  it('should return 404 if house to update not found', async () => {
    jest.spyOn(houseService, 'updateHouse').mockRejectedValue(new Error('House not found'));

    const response = await request(app).put('/api/v1/houses/66ce0af55d90e92eb2fc4e1a').send({
      name: 'Nonexistent House',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('House not found');
  });

  it('should delete a house by ID', async () => {
    jest.spyOn(houseService, 'deleteHouse').mockResolvedValue();

    const response = await request(app).delete(`/api/v1/houses/${mockId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('House deleted successfully');
  });

  it('should return 404 if house to delete not found', async () => {
    jest.spyOn(houseService, 'deleteHouse').mockRejectedValue(new Error('House not found'));

    const response = await request(app).delete('/api/v1/houses/66ce0af55d90e92eb2fc4e1a');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('House not found');
  });
});
