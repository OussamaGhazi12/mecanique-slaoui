const express = require('express');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const router = express.Router();

// Ajouter un produit au panier
router.post('/', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  let userId;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
  }

  const { productId, quantity } = req.body;

  if (userId) {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products.push({ productId, quantity });
      await cart.save();
      return res.status(200).json({ success: true, message: 'Product added to cart' });
    } else {
      const newCart = new Cart({ userId, products: [{ productId, quantity }] });
      await newCart.save();
      return res.status(201).json({ success: true, message: 'Cart created and product added' });
    }
  } else {
    let cart = JSON.parse(req.cookies.cart || '[]');
    cart.push({ productId, quantity });
    res.cookie('cart', JSON.stringify(cart), { httpOnly: true });
    return res.status(200).json({ success: true, message: 'Product added to cart (anonymous)' });
  }
});

module.exports = router;
