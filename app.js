const express = require('express');
const cors = require('cors');
const swaggerMiddleware = require('./src/config/swagger');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Swagger
swaggerMiddleware(app);

// Routes
const authRoutes = require('./src/features/auth/routes');
const plantRoutes = require('./src/features/plant/routes');
const houseRoutes = require('./src/features/house/routes');
const roomRoutes = require('./src/features/room/routes');

const apiRootPath = '/api/v1';

app.use(`${apiRootPath}/auth`, authRoutes);
app.use(`${apiRootPath}`, plantRoutes);
app.use(`${apiRootPath}`, houseRoutes);
app.use(`${apiRootPath}`, roomRoutes);

module.exports = app;
