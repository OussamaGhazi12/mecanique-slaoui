const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const verifyToken = require('../../middlewares/verifyToken'); // middleware dyal JWT
const verifyAdmin = require('../../middlewares/verifyAdmin'); // middleware dyal admin verification

const bcrypt = require('bcryptjs'); // pour hasher le mot de passe

router.get('/setting', verifyToken, verifyAdmin, async (req, res) => {
  console.log("User ID from token:", req.user.userId);  // debug

  try {
    const adminUser = await User.findById(req.user.userId).select('-password');
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(adminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// PUT /api/admin/setting
router.put('/setting', verifyToken, verifyAdmin, async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Modifier les champs si fournis
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
