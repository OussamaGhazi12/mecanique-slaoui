const express = require('express');
const router  = express.Router();
const Reservation = require('../models/Reservation');
const verifyToken  = require('../middlewares/verifyToken');

router.post('/', verifyToken, async (req, res) => {
  const { phone, date, time, service } = req.body;
  const userId   = req.user.userId;   // ID from JWT payload
  const fullName = req.user.fullName; // User's full name from JWT payload

  // Validate required fields
  if (!phone || !date || !time || !service) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Create new reservation including userId and fullName
    const newReservation = new Reservation({
      phone,
      date,
      time,
      service,
      userId,
      fullName
    });

    await newReservation.save();

    res.status(201).json({
      message: 'Réservation enregistrée avec succès.',
      reservation: newReservation
    });
  } catch (error) {
    console.error('Error saving reservation:', error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement." });
  }
});

module.exports = router;