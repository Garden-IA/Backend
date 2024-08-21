const request = require('supertest');
const app = require('../../app'); // Asegúrate de exportar la aplicación desde app.js
const mongoose = require('mongoose');
const User = require('../../src/features/auth/model'); // Asegúrate de ajustar la ruta según tu estructura

describe('Autenticación', function () {
  before(async function () {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async function () {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/auth/register', function () {
    it('Debería registrar un nuevo usuario', async function () {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'testuser@example.com',
        password: 'password123',
      });

      res.should.have.status(201);
      res.should.be.json;
      res.body.should.have.property('message').eql('User created');
    });
  });

  describe('POST /api/v1/auth/login', function () {
    it('Debería iniciar sesión con credenciales válidas', async function () {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'testuser@example.com',
        password: 'password123',
      });

      res.should.have.status(200);
      res.should.be.json;
      res.body.should.have.property('token');
    });
  });
});
