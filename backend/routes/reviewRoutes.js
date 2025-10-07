const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');  // importer model Product
const verifyToken = require('../middlewares/verifyToken');

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const ratings = reviews.map(r => r.rating);
    const averageRating = ratings.length > 0
      ? (ratings.reduce((acc, val) => acc + val, 0) / ratings.length).toFixed(2)
      : null;

    res.status(200).json({
      success: true,
      reviews,
      averageRating: averageRating ? parseFloat(averageRating) : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Post a review (with auth)
router.post('/', verifyToken, async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.userId;
  const fullName = req.user.fullName;

  if (!productId || !rating || !comment || !fullName) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants' });
  }

  try {
    // Récupérer le produit pour avoir son nom
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    const newReview = new Review({
      productId,
      productName: product.name, // stocker le nom ici
      rating,
      comment,
      userId,
      username: fullName,
    });

    const savedReview = await newReview.save();
    res.status(201).json({ success: true, review: savedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Update a review
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { comment, rating } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { comment, rating },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Avis introuvable.' });
    }

    res.status(200).json({ review: updatedReview });
  } catch (error) {
    console.error("Erreur update review:", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Delete a review
router.delete('/:reviewId', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Avis non trouvé' });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Non autorisé à supprimer cet avis' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Avis supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
