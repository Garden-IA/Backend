const mongoose = require('mongoose');
const { Schema } = mongoose;

const plantSchema = new Schema({
  // Información básica
  name: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    required: false,
  },
  species: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String, // URL de la imagen de la planta
    required: false,
  },

  // Datos de cuidado
  waterFrequency: {
    type: Number, // En días
    required: true,
  },
  sunlight: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Cantidad de luz que necesita
    required: true,
  },
  temperatureRange: {
    min: {
      type: Number, // Temperatura mínima recomendada (°C)
      required: false,
    },
    max: {
      type: Number, // Temperatura máxima recomendada (°C)
      required: false,
    },
  },
  humidity: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Preferencia de humedad
    required: false,
  },
  fertilizingFrequency: {
    type: Number, // En días
    required: false,
  },

  // Fechas de cuidado
  lastWatered: {
    type: Date,
    required: false,
  },
  lastFertilized: {
    type: Date,
    required: false,
  },
  lastRepotted: {
    type: Date,
    required: false,
  },
  dateAcquired: {
    type: Date,
    required: false,
  },

  // Otros
  notes: {
    type: String,
    required: false,
  },
  room: {
    type: Schema.Types.ObjectId, // Referencia a la habitación en la que está la planta
    ref: 'Room',
    required: true,
  },
  isAlive: {
    type: Boolean,
    default: true, // Para marcar si la planta sigue viva o no
  },

  // Tiempos de registro
  createdAt: {
    type: Date,
    default: Date.now, // Fecha de creación del registro
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Fecha de la última actualización del registro
  },
});

plantSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plant', plantSchema);
