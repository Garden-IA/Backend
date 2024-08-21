const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: false, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    active: { type: Boolean, default: true }, // Valor por defecto: true
    roles: { type: [String], default: ['user'] }, // Valor por defecto: ['user']
    profilePicture: { type: String, required: false },
    lastLogin: { type: Date, default: null }, // Valor por defecto: null
    bio: { type: String, required: false },
    phoneNumber: { type: String, required: false },
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  },
);

module.exports = mongoose.model('User', userSchema);
