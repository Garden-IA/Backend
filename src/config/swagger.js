/**
 * @module config/swagger
 * @description Configuración de Swagger para documentar la API.
 * Este módulo configura Swagger para generar documentación interactiva para la API utilizando Swagger UI y swagger-jsdoc.
 */

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Definición básica de Swagger
const swaggerDefinition = {
  openapi: '3.0.0', // Versión del estándar OpenAPI
  info: {
    title: 'My API', // Título de la API
    version: '1.0.0', // Versión de la API
    description: 'A simple Express API', // Descripción de la API
  },
  servers: [
    {
      url: 'http://localhost:3000', // URL del servidor de desarrollo
      description: 'Development server', // Descripción del servidor
    },
  ],
};

// Opciones para la configuración de Swagger
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../features/**/*js')], // Ruta a los archivos de documentación de la API
};

// Inicializar swagger-jsdoc con las opciones proporcionadas
const swaggerSpec = swaggerJSDoc(options);

/**
 * Middleware para servir la documentación de Swagger.
 *
 * @param {Object} app - La instancia de la aplicación Express.
 * @returns {void}
 */
const swaggerMiddleware = app => {
  // Servir la documentación de Swagger en la ruta '/api-docs'
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerMiddleware;
