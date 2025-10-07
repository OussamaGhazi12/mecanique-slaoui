const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/profile', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Private data 💼', user: req.user });
});

module.exports = router;
