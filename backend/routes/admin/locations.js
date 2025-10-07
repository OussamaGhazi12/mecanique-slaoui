const express = require('express');
const router = express.Router();
const Location = require('../../models/locationModel');
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');



// GET - Récupérer toutes les locations
router.get('/', verifyToken,verifyAdmin, async (req, res) => {
  try {
    const locations = await Location.find().sort({ date: -1 }); // dernières en premier
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des locations', error });
  }
});



// DELETE - Supprimer une location par ID
router.delete('/:id', verifyToken,verifyAdmin, async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) return res.status(404).json({ message: 'Location non trouvée' });
    res.json({ message: 'Location supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la location', error });
  }
});

module.exports = router;
