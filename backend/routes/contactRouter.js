// routes/contactRouter.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST route to receive contact form data
router.post('/contact', async (req, res) => {
  try {
    const { name, phone, email, address, message } = req.body;

    // Simple validation
    if (!name || !phone || !email || !address || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = new Contact({
      name,
      phone,
      email,
      address,
      message
    });

    await newContact.save();

    res.status(201).json({ message: 'Merci! Ghadin ntwaslo m3ak inchaAllah.' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
