const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const upload = require('../../middlewares/upload'); // import multer


// ✅ POST Create New Product
// ✅ POST Create New Product (avec image)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, subcategory, stock } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subcategory,
      stock,
      image: imagePath,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la création du produit', error: err.message });
  }
});

// ✅ GET All Products (Admin)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: err.message });
  }
});



router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const updatedImage = req.file ? `/uploads/${req.file.filename}` : existingProduct.image;

    const {
      name = existingProduct.name,
      description = existingProduct.description,
      price,
      category = existingProduct.category,
      subcategory = existingProduct.subcategory,
      stock
    } = req.body || {};

    const updatedFields = {
      name,
      description,
      price: price !== undefined && price !== '' ? Number(price) : existingProduct.price,
      category,
      subcategory,
      stock: stock !== undefined && stock !== '' ? Number(stock) : existingProduct.stock,
      image: updatedImage,
    };

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });
    return res.status(200).json(updatedProduct);

  } catch (err) {
    res.status(500).json({
      message: 'Erreur serveur lors de la mise à jour',
      error: err.message
    });
  }
});





// ✅ DELETE a Product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: err.message });
  }
});

module.exports = router;