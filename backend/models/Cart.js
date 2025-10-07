const mongoose = require('mongoose');

// Crée un schéma pour le panier
const cartSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    items: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true, 
          default: 1 
        },
        name: String,
        price: Number,
        image: String,
      }
    ],
    totalPrice: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true } // Ajouter des timestamps (createdAt, updatedAt)
);

// Calculer le prix total du panier avant d'enregistrer
cartSchema.pre('save', function(next) {
  let total = 0;
  this.items.forEach(item => {
    total += item.price * item.quantity;
  });
  this.totalPrice = total;
  next();
});

// Créer le modèle à partir du schéma
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
