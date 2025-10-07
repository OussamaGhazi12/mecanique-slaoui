const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,   // "YYYY-MM-DD"
    required: true
  },
  time: {
    type: String,   // "HH:mm"
    required: true
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // Assurez-vous d'avoir un modèle User
    required: false
  },
  fullName: {         // Nom complet de l'utilisateur
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
