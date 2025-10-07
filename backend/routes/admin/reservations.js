const express = require('express');
const router = express.Router();
const Reservation = require('../../models/Reservation');
const verifyAdmin = require('../../middlewares/verifyAdmin');
const verifyToken = require('../../middlewares/verifyToken');

// GET /api/admin/reservations => récupérer toutes les réservations
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des réservations.' });
  }
});

// POST /api/admin/reservations => ajouter une nouvelle réservation
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { phone, date, time, service, fullName, userId } = req.body;

    if (!phone || !date || !time || !service || !fullName) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs requis.' });
    }

    const phoneRegex = /^(06|07)[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: 'Numéro de téléphone invalide. Il doit commencer par 06 ou 07 et contenir 10 chiffres.',
      });
    }

    const existingReservation = await Reservation.findOne({ date, time });
    if (existingReservation) {
      return res.status(409).json({ message: 'Ce créneau horaire est déjà réservé.' });
    }

    const newReservation = new Reservation({
      phone,
      date,
      time,
      service,
      fullName,
      userId: userId || null,
    });

    await newReservation.save();
    res.status(201).json({ message: 'Réservation créée avec succès', reservation: newReservation });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation.' });
  }
});

// DELETE /api/admin/reservations/:id => supprimer une réservation
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    res.status(200).json({ message: 'Réservation supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la réservation.' });
  }
});

// PUT update
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { fullName, phone, service, date, time } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée.' });

    // Optionnel: vérifier conflits horaires

    reservation.fullName = fullName;
    reservation.phone = phone;
    reservation.service = service;
    reservation.date = date;
    reservation.time = time;

    await reservation.save();

    res.status(200).json({ message: 'Réservation mise à jour.', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
});

// DELETE déjà OK

module.exports = router;
