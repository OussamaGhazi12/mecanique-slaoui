const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    // 1. Aggregation dyal les best-selling productIds
    const topSelling = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit }
    ]);

    // 2. Extract productIds
    const productIds = topSelling.map(p => p._id);
    const products = await Product.find({ _id: { $in: productIds } });

    // 3. Merge data (product info + total sold)
    const merged = topSelling.map(p => {
      const product = products.find(prod => prod._id.toString() === p._id.toString());
      return {
        productId: p._id,
        name: product?.name || "Produit inconnu",
        image: product?.image || "",
        price: product?.price || 0,
        totalSold: p.totalSold
      };
    });

    res.status(200).json({ success: true, data: merged });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;
