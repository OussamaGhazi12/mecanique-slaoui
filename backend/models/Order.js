const mongoose = require('mongoose'); 

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  userFullName: { type: String, required: false },  // Nouveau champ pour le nom complet
  shipping: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
  },
  products: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Order', OrderSchema);
