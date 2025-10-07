// /router/topReviewsRouter.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    // Group by productId, calcule moyenne et nombre d'avis
    const topReviews = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1, totalReviews: -1 } },
      { $limit: 6 }
    ]);

    // Fetch infos des produits liés
    const productIds = topReviews.map(r => r._id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Fusionner les données produit + rating
    const merged = topReviews.map(r => {
      const product = products.find(p => p._id.toString() === r._id.toString());
      return {
        productId: r._id,
        name: product?.name || "Produit inconnu",
        image: product?.image || "",
        price: product?.price || 0,
        averageRating: r.averageRating.toFixed(2),
        totalReviews: r.totalReviews
      };
    });

    res.status(200).json({ success: true, data: merged });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;
