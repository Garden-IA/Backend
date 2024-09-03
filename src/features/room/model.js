/**
 * @module features/room/model
 * @description Definición del esquema del modelo de la habitación para MongoDB utilizando Mongoose.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Esquema de la habitación.
 *
 * @typedef {Object} Room
 * @property {string} name - El nombre de la habitación.
 * @property {string} type - El tipo de habitación (por ejemplo, dormitorio, sala de estar).
 * @property {string} humidity - El nivel de humedad en la habitación (bajo, medio, alto).
 * @property {boolean} airConditioner - Indica si hay aire acondicionado en la habitación.
 * @property {boolean} radiator - Indica si hay radiador en la habitación.
 * @property {string} light - El nivel de luz en la habitación (bajo, medio, alto).
 * @property {Array<Schema.Types.ObjectId>} plants - Array de referencias a las plantas en la habitación.
 * @property {Date} createdAt - La fecha en que se creó el registro.
 * @property {Date} updatedAt - La fecha de la última actualización del registro.
 */
const roomSchema = new Schema({
  /**
   * Nombre de la habitación.
   *
   * @type {String}
   * @required
   */
  name: {
    type: String,
    required: true,
  },

  /**
   * Tipo de habitación (por ejemplo, dormitorio, sala de estar).
   *
   * @type {String}
   * @required
   */
  type: {
    type: String,
    required: true,
  },

  /**
   * Nivel de humedad en la habitación.
   * Los valores posibles son: 'low', 'medium', 'high'.
   *
   * @type {String}
   * @enum ["low", "medium", "high"]
   * @required
   */
  humidity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },

  /**
   * Indica si hay aire acondicionado en la habitación.
   *
   * @type {Boolean}
   * @default false
   */
  airConditioner: {
    type: Boolean,
    default: false,
  },

  /**
   * Indica si hay radiador en la habitación.
   *
   * @type {Boolean}
   * @default false
   */
  radiator: {
    type: Boolean,
    default: false,
  },

  /**
   * Nivel de luz en la habitación.
   * Los valores posibles son: 'low', 'medium', 'high'.
   *
   * @type {String}
   * @enum ['low', 'medium', 'high']
   * @required
   */
  light: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },

  /**
   * Array de referencias a las plantas en la habitación.
   *
   * @type {Array<Schema.Types.ObjectId>}
   * @ref Plant
   * @optional
   */
  plants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Plant', // Referencia al esquema de planta
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
roomSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Room', roomSchema);
