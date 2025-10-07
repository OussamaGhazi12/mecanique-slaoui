const express = require('express');
const router = express.Router();
const Material = require('../../models/material');
const upload = require('../../middlewares/uploadMaterial');
const fs = require('fs');
const path = require('path');

// ✅ GET : Récupérer tous les matériaux
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find();
    res.status(200).json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ POST : Ajouter un nouveau matériau avec image
router.post('/', upload.single('img'), async (req, res) => {
  const { name, stock } = req.body;
  const imgPath = req.file ? `uploads/materials/${req.file.filename}` : null;

  try {
    const newMaterial = new Material({
      name,
      img: imgPath,
      stock: Number(stock)
    });
    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erreur lors de l’ajout du matériau' });
  }
});

// ✅ PUT : Modifier un matériau existant
router.put('/:id', upload.single('img'), async (req, res) => {
  const { id } = req.params;
  const { name, stock } = req.body;

  try {
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ error: 'Matériau introuvable' });
    }

    // Supprimer l’ancienne image si une nouvelle est envoyée
    if (req.file) {
      const oldImgPath = path.join(__dirname, '../../', material.img);
      if (material.img && fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath);
      }
      material.img = `uploads/materials/${req.file.filename}`;
    }

    // Mettre à jour les autres champs
    material.name = name || material.name;
    if (stock !== undefined) material.stock = Number(stock);

    await material.save();
    res.status(200).json(material);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// ✅ DELETE : Supprimer un matériau et son image
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findByIdAndDelete(id);
    if (!material) {
      return res.status(404).json({ error: 'Matériau introuvable' });
    }

    // Supprimer l'image si elle existe
    if (material.img) {
      const fullImgPath = path.join(__dirname, '../../', material.img);
      if (fs.existsSync(fullImgPath)) {
        fs.unlinkSync(fullImgPath);
      }
    }

    res.status(200).json({ message: 'Matériau supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

module.exports = router;
