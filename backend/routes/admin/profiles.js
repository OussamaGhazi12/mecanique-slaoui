const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const verifyToken = require('../../middlewares/verifyToken'); // extrait req.userId

// GET tous les admins
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user); // Un seul user ici, pas un tableau
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


// PUT update profil admin connecté
router.put('/', verifyToken, async (req, res) => {
  console.log('UserID from token:', req.userId); // Ajoute ça pour debug

  try {
    const { fullName, email, password } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    if (password && password.trim() !== '') {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
  }
});


module.exports = router;
