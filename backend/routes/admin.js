const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/dashboard', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: `Welcome admin ${req.user.fullName}!` });
});

module.exports = router;
