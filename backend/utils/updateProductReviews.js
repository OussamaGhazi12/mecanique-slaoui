const Review = require('../models/Review');
const Product = require('../models/Product');

const updateProductReviews = async (productId) => {
  try {
    const reviews = await Review.find({ productId });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    await Product.findByIdAndUpdate(productId, {
      reviews: totalReviews,
      rating: averageRating.toFixed(1), // Tu peux aussi laisser en float si tu veux
    });

  } catch (err) {
    console.error('Erreur dans updateProductReviews:', err);
  }
};

module.exports = updateProductReviews;
