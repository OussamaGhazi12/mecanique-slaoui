const express = require('express');
const router = express.Router();
const Contact = require('../../models/Contact');
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');

// GET all contact messages (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors du chargement des messages' });
  }
});

// DELETE contact message by ID
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Message introuvable' });
    }
    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

module.exports = router;
