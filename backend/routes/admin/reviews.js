const express = require('express');
const router = express.Router();
const Review = require('../../models/Review');
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');

// GET all reviews - accessible aux admins uniquement
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// DELETE review by id - admin
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Avis non trouvé.' });
    res.status(200).json({ message: 'Avis supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
  }
});

// PUT update review by id - admin
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Avis non trouvé.' });
    res.status(200).json({ message: 'Avis mis à jour.', review: updated });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
});

module.exports = router;
