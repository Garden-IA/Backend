// config/multerConfig.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta donde se guardarán los archivos subidos
const uploadDir = path.join(__dirname, '../uploads');

// Verificar si la carpeta existe, si no, crearla
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configuración del almacenamiento de Multer.
 * Define dónde y cómo se guardarán los archivos subidos.
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  /**
   * Especifica la carpeta de destino para los archivos subidos.
   * @param {Express.Request} req - El objeto de solicitud de Express.
   * @param {Express.Multer.File} file - El archivo que se está subiendo.
   * @param {Function} cb - Callback para definir la ruta de destino.
   */
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Carpeta donde se almacenarán las imágenes
  },
  /**
   * Define el nombre del archivo subido.
   * @param {Express.Request} req - El objeto de solicitud de Express.
   * @param {Express.Multer.File} file - El archivo que se está subiendo.
   * @param {Function} cb - Callback para definir el nombre del archivo.
   */
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada imagen
  },
});

/**
 * Filtro para permitir solo ciertos tipos de archivos.
 * @param {Express.Request} req - El objeto de solicitud de Express.
 * @param {Express.Multer.File} file - El archivo que se está subiendo.
 * @param {Function} cb - Callback para aceptar o rechazar el archivo.
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Acepta el archivo
  } else {
    cb(new Error('Tipo de archivo no permitido')); // Rechaza el archivo
  }
};

/**
 * Configuración completa de Multer, incluyendo almacenamiento, filtro de archivos y límites de tamaño.
 * @type {Object}
 * @property {multer.StorageEngine} storage - Configuración del almacenamiento.
 * @property {Function} fileFilter - Filtro para validar tipos de archivos.
 * @property {Object} limits - Límites de tamaño de los archivos.
 */
const multerConfig = {
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB por archivo
};

module.exports = multerConfig;
