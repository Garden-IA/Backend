// middlewares/multer.js
const multer = require('multer');
const multerConfig = require('../config/multerConfig');

/**
 * Middleware de Multer configurado para manejar la subida de archivos.
 * @type {multer.Multer}
 */
const upload = multer(multerConfig);

module.exports = upload;
