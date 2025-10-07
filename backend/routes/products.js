const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET: Retrieve all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Retrieve a product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Add a new product
router.post('/', async (req, res) => {
  const { name, description, category, subcategory, price, image, stock } = req.body;
  try {
    const newProduct = new Product({ 
      name, 
      description, 
      category, 
      subcategory, 
      price, 
      image, 
      stock // on utilise stock au lieu de quantity
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error: error.message });
  }
});

// PUT: Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, category, subcategory, price, image, stock } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        name, 
        description, 
        category, 
        subcategory, 
        price, 
        image, 
        stock // mise à jour du stock
      },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE: Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
