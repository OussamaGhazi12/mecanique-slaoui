const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');

// GET toutes les commandes
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Erreur en récupérant les commandes:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE une commande par ID
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ message: 'Commande supprimée avec succès' });
  } catch (err) {
    console.error('Erreur en supprimant la commande:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// UPDATE une commande par ID
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedData = req.body;  // data jaya men frontend (ex: status, adresse, etc.)

    // Trouver la commande et la mettre à jour avec les nouvelles données
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedData, {
      new: true, // retourne le document modifié
      runValidators: true, // valide les champs selon le schema
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(updatedOrder); // renvoyer la commande mise à jour
  } catch (err) {
    console.error('Erreur en mettant à jour la commande:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
