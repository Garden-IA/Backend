const request = require('supertest');
const express = require('express');
const app = require('../../../../app'); // Ajusta la ruta a tu archivo principal de la aplicación

let authToken;
let houseId;

beforeAll(async () => {
  // Obtener el token Bearer

  const registerResponse = await request(app)
    .post('/api/v1/auth/register') // Ajusta la ruta de login según tu API
    .send({
      email: 'housetest@example.com', // Ajusta el usuario y contraseña según tu configuración
      password: 'testpassword',
    });

  const authResponse = await request(app)
    .post('/api/v1/auth/login') // Ajusta la ruta de login según tu API
    .send({
      email: 'housetest@example.com', // Ajusta el usuario y contraseña según tu configuración
      password: 'testpassword',
    });

  console.log(JSON.stringify(authResponse));
  expect(authResponse.status).toBe(200);
  expect(authResponse.body).toHaveProperty('token');
  authToken = authResponse.body.token;
});

describe('House Controller Integration', () => {
  it('should create a new house', async () => {
    const response = await request(app).post('/api/v1/houses').set('Authorization', `Bearer ${authToken}`).send({
      name: 'New House',
      location: 'New Location',
      description: 'A new house description',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    houseId = response.body.id;
  });

  it('should get all houses', async () => {
    const response = await request(app).get('/api/v1/houses').set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a house by ID', async () => {
    const response = await request(app).get(`/api/v1/houses/${houseId}`).set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', houseId);
    expect(response.body).toHaveProperty('name', 'New House');
  });

  it('should update a house by ID', async () => {
    const response = await request(app)
      .put(`/api/v1/houses/${houseId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated House', location: 'Updated Location' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'House updated successfully');
    expect(response.body.house).toHaveProperty('name', 'Updated House');
  });

  it('should delete a house by ID', async () => {
    const response = await request(app).delete(`/api/v1/houses/${houseId}`).set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'House deleted successfully');
  });
});
