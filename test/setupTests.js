// test/setupTests.js
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/testdb';
const User = require('../src/features/auth/model');

// Configurar y conectar a la base de datos de prueba
beforeAll(async () => {
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connect(url);
  await User.deleteMany({});
  await mongoose.connection.close();
});
