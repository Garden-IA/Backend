const request = require('supertest');
const express = require('express');
const houseService = require('../../../../src/features/house/service');
const houseController = require('../../../../src/features/house/controller');

// Crear una instancia de Express y configurar las rutas
const app = express();
app.use(express.json());

app.post('/api/v1/houses', houseController.createHouse);
app.get('/api/v1/houses', houseController.getAllHouses);
app.get('/api/v1/houses/:id', houseController.getHouseById);
app.put('/api/v1/houses/:id', houseController.updateHouse);
app.delete('/api/v1/houses/:id', houseController.deleteHouse);

describe('House Controller', () => {
  it('should create a new house', async () => {
    const response = await request(app).post('/api/v1/houses').send({
      name: 'Beautiful House',
      location: 'New York',
      description: 'A beautiful house in New York',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('House created successfully');
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 if name or location is missing', async () => {
    const response = await request(app).post('/api/v1/houses').send({
      name: 'House Without Location',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name and location are required');
  });

  it('should get all houses', async () => {
    await request(app).post('/api/v1/houses').send({
      name: 'Another House',
      location: 'Los Angeles',
    });

    const response = await request(app).get('/api/v1/houses');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a house by ID', async () => {
    const houseResponse = await request(app).post('/api/v1/houses').send({
      name: 'Test House',
      location: 'Chicago',
    });

    const houseId = houseResponse.body.id;

    const response = await request(app).get(`/api/v1/houses/${houseId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test House');
    expect(response.body.location).toBe('Chicago');
  });

  it('should return 404 if house not found', async () => {
    const response = await request(app).get('/api/v1/houses/66ce0af55d90e92eb2fc4e1a');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('House not found');
  });

  it('should update a house by ID', async () => {
    const houseResponse = await request(app).post('/api/v1/houses').send({
      name: 'Update House',
      location: 'San Francisco',
    });

    const houseId = houseResponse.body.id;

    const response = await request(app).put(`/api/v1/houses/${houseId}`).send({
      name: 'Updated House',
      location: 'San Francisco Updated',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('House updated successfully');
    expect(response.body.house.name).toBe('Updated House');
  });

  it('should return 404 if house to update not found', async () => {
    const response = await request(app).put('/api/v1/houses/66ce0af55d90e92eb2fc4e1a').send({
      name: 'Nonexistent House',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('House not found');
  });

  it('should delete a house by ID', async () => {
    const houseResponse = await request(app).post('/api/v1/houses').send({
      name: 'Delete House',
      location: 'Houston',
    });

    const houseId = houseResponse.body.id;

    const response = await request(app).delete(`/api/v1/houses/${houseId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('House deleted successfully');
  });

  it('should return 404 if house to delete not found', async () => {
    const response = await request(app).delete('/api/v1/houses/66ce0af55d90e92eb2fc4e1a');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('House not found');
  });
});
