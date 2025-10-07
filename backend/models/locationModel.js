const mongoose = require('mongoose');

// Définir le schéma de localisation
const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  phone: { type: String, required: true }, // Ajouter le champ téléphone
  date: { type: Date, default: Date.now }
});

// Créer le modèle Location
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
