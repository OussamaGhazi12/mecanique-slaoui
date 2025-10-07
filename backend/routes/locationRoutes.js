const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');  // Importer correctement le modèle Location

// Route pour recevoir la localisation
router.post('/', (req, res) => {
  const { latitude, longitude, phone } = req.body;

  // Vérifier si les coordonnées et le téléphone sont présents dans la requête
  if (!latitude || !longitude || !phone) {
    return res.status(400).json({ message: "Les coordonnées de localisation ou le numéro de téléphone sont manquants." });
  }

  // Créer une nouvelle localisation à partir des données reçues
  const newLocation = new Location({
    latitude,
    longitude,
    phone
  });

  // Enregistrer la localisation dans la base de données
  newLocation.save()
    .then(() => {
      console.log(`Localisation enregistrée : Latitude ${latitude}, Longitude ${longitude}, Phone: ${phone}`);
      res.status(200).json({ message: 'Votre localisation et numéro de téléphone ont bien été reçus et enregistrés.' });
    })
    .catch((error) => {
      console.error("Erreur lors de l'enregistrement de la localisation:", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    });
});

module.exports = router;
