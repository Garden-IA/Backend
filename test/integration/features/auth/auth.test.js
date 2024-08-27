const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authController = require('../../../../src/features/auth/controller');
const app = require('../../../../app'); // Importar la app configurada

// Configurar el servidor Express para pruebas de integración
app.use(bodyParser.json());
app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/auth/profile', authController.getProfile);
app.put('/api/v1/auth/profile', authController.updateProfile);

// Test de integración para el registro
describe('Auth Integration Tests', () => {
  test('should register a new user, login, and get the profile', async () => {
    const registerResponse = await request(app).post('/api/v1/auth/register').send({ email: 'test@example.com', password: 'password123' });

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post('/api/v1/auth/login').send({ email: 'test@example.com', password: 'password123' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    const profileResponse = await request(app).post('/api/v1/auth/profile').send({ id: loginResponse.body.id });

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('email', 'test@example.com');
  });
});
