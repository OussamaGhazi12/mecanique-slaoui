const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  price:       { type: Number, required: true },
  category:    String,
  subcategory: String,
  image:       String,
  rating:      { type: Number, default: 0 },
  reviews:     { type: Number, default: 0 },
  stock:       { type: Number, default: 0 }  // Champ renommé en stock
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
