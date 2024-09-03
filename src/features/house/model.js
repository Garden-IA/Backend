/**
 * @module features/house/model
 * @description Definición del esquema del modelo de casa para MongoDB utilizando Mongoose.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Esquema de la casa.
 *
 * @typedef {Object} House
 * @property {string} name - El nombre de la casa.
 * @property {string} location - La ubicación de la casa.
 * @property {string} [description] - Una descripción opcional de la casa.
 * @property {Array<Schema.Types.ObjectId>} [rooms] - Array de referencias a las habitaciones.
 * @property {Date} createdAt - La fecha en que se creó el registro.
 * @property {Date} updatedAt - La fecha de la última actualización del registro.
 */
const houseSchema = new Schema({
  /**
   * Nombre de la casa.
   *
   * @type {String}
   * @required
   */
  name: {
    type: String,
    required: true,
  },

  /**
   * Ubicación de la casa.
   *
   * @type {String}
   * @required
   */
  location: {
    type: String,
    required: true,
  },

  /**
   * Descripción opcional de la casa.
   *
   * @type {String}
   * @optional
   */
  description: {
    type: String,
    required: false,
  },

  /**
   * Array de referencias a las habitaciones.
   *
   * @type {Array<Schema.Types.ObjectId>}
   * @ref Room
   * @optional
   */
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room', // Referencia al esquema de habitación
      required: false,
    },
  ],

  /**
   * Fecha en que se creó el registro.
   *
   * @type {Date}
   * @default Date.now
   */
  createdAt: {
    type: Date,
    default: Date.now,
  },

  /**
   * Fecha de la última actualización del registro.
   *
   * @type {Date}
   * @default Date.now
   */
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Middleware para actualizar la fecha de actualización antes de guardar.
 *
 * @function
 * @param {Function} next - La función de callback para el siguiente middleware.
 */
houseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('House', houseSchema);
