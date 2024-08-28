const app = require('./app');
const logger = require('./src/config/logger');
const connectToDatabase = require('./src/config/database');

const path = require('path');
const envFile = `.env.${process.env.NODE_ENV}`;
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

const port = process.env.PORT || 3000;

// Conectar a la base de datos y empezar a escuchar en el puerto
connectToDatabase().then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
});
