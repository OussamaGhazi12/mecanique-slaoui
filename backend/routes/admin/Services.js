const express = require('express');
const router = express.Router();
const Service = require('../../models/Service');
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');
const upload = require('../../middlewares/uploadService');

// Ajouter un service avec upload (image principale + images secondaires)
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'serviceImages', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const { title, description, category, details } = req.body;

      // Récupérer chemins des fichiers uploadés
      const imagePath = req.files['image'] ? `/uploads/services/${req.files['image'][0].filename}` : null;

      let serviceImagesPaths = [];
      if (req.files['serviceImages']) {
        serviceImagesPaths = req.files['serviceImages'].map(file => `/uploads/services/${file.filename}`);
      }

      // details peut être JSON string ou tableau
      let parsedDetails = [];
      if (details) {
        if (typeof details === 'string') {
          try {
            parsedDetails = JSON.parse(details);
          } catch {
            parsedDetails = details.split('\n').map(s => s.trim()).filter(Boolean);
          }
        } else if (Array.isArray(details)) {
          parsedDetails = details;
        }
      }

      const newService = new Service({
        image: imagePath,
        title,
        description,
        category,
        details: parsedDetails,
        serviceImages: serviceImagesPaths
      });

      await newService.save();

      res.status(201).json({ message: 'Service ajouté avec succès', service: newService });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du service', error: err.message });
    }
  }
);

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Update service with upload
router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'serviceImages', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const serviceId = req.params.id;

      const service = await Service.findById(serviceId);
      if (!service) return res.status(404).json({ message: 'Service non trouvé' });

      let updateData = { ...req.body };

      if (updateData.details && typeof updateData.details === 'string') {
        try {
          updateData.details = JSON.parse(updateData.details);
        } catch {
          updateData.details = updateData.details.split('\n').map(s => s.trim()).filter(Boolean);
        }
      }

      // Mise à jour image principale
      if (req.files['image'] && req.files['image'][0]) {
        updateData.image = `/uploads/services/${req.files['image'][0].filename}`;
      }

      // Mise à jour images secondaires
      if (req.files['serviceImages']) {
        const imagesPaths = req.files['serviceImages'].map(file => `/uploads/services/${file.filename}`);
        updateData.serviceImages = Array.isArray(service.serviceImages) ? service.serviceImages.concat(imagesPaths) : imagesPaths;
      } else if (updateData.serviceImages && typeof updateData.serviceImages === 'string') {
        try {
          updateData.serviceImages = JSON.parse(updateData.serviceImages);
        } catch {
          updateData.serviceImages = updateData.serviceImages.split('\n').map(s => s.trim()).filter(Boolean);
        }
      }

      const updatedService = await Service.findByIdAndUpdate(serviceId, updateData, {
        new: true,
        runValidators: true,
      });

      res.json({ message: 'Service mis à jour avec succès', service: updatedService });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
    }
  }
);

// Delete service
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service non trouvé' });
    res.json({ message: 'Service supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
});

module.exports = router;
