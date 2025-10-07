const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { shipping, products, totalAmount, status, date } = req.body;
    const userId = req.user ? req.user.userId : null;
    const userFullName = req.user ? req.user.fullName : null;

    // Vérifier et mettre à jour le stock
    for (const item of products) {
      const prod = await Product.findById(item.productId);
      if (!prod) {
        return res.status(404).json({ message: `Produit introuvable: ${item.productId}` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${prod.name}` });
      }
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }, { new: true });
    }

    // Créer la commande avec userId et userFullName
    const orderData = {
      userId,
      userFullName,
      shipping,
      products,
      totalAmount,
      status: status || 'paid',
      date: date || new Date().toISOString(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ message: 'Commande enregistrée avec succès', order: newOrder });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
});

router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
