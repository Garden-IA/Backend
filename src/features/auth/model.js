const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @module features/auth/model
 * @description Definición del esquema del modelo de usuario para MongoDB utilizando Mongoose.
 */

/**
 * Esquema de usuario para el modelo de MongoDB.
 *
 * @typedef {Object} UserSchema
 * @property {String} [username] - Nombre de usuario, opcional, en minúsculas y sin espacios adicionales.
 * @property {String} password - Contraseña del usuario, obligatoria.
 * @property {String} email - Correo electrónico del usuario, obligatorio, único, en minúsculas y sin espacios adicionales.
 * @property {String} [firstName] - Primer nombre del usuario, opcional, en minúsculas y sin espacios adicionales.
 * @property {String} [lastName] - Apellido del usuario, opcional, en minúsculas y sin espacios adicionales.
 * @property {Boolean} [active=true] - Estado de activación del usuario, por defecto es `true`.
 * @property {String[]} [roles=['user']] - Roles del usuario, por defecto contiene `['user']`.
 * @property {String} [profilePicture] - URL de la imagen de perfil del usuario, opcional.
 * @property {Date} [lastLogin=null] - Fecha del último inicio de sesión, por defecto es `null`.
 * @property {String} [bio] - Biografía del usuario, opcional, en minúsculas y sin espacios adicionales.
 * @property {String} [phoneNumber] - Número de teléfono del usuario, opcional, en minúsculas y sin espacios adicionales.
 * @property {Array<Schema.Types.ObjectId>} [houses] - Array de referencias a las casas del usuario.
 */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: false, unique: false, lowercase: true, trim: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, required: false, lowercase: true, trim: true },
    lastName: { type: String, required: false, lowercase: true, trim: true },
    active: { type: Boolean, default: true }, // Valor por defecto: true
    roles: { type: [String], default: ['user'] }, // Valor por defecto: ['user']
    profilePicture: { type: String, required: false },
    lastLogin: { type: Date, default: null }, // Valor por defecto: null
    bio: { type: String, required: false, lowercase: true, trim: true },
    phoneNumber: { type: String, required: false, lowercase: true, trim: true },
    houses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'House', // Referencia al esquema de casa
        required: false,
      },
    ],
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  },
);

module.exports = mongoose.model('User', userSchema);
