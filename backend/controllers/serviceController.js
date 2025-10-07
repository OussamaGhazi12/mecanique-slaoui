// controllers/serviceController.js
const Service = require('../models/Service');

// GET all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service introuvable' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// CREATE a new service
exports.createService = async (req, res) => {
  console.log('📩 Reçu :', req.body);
  try {
    const newService = new Service(req.body);
    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('⛔ Erreur ajout :', error);
    res.status(400).json({ message: 'Erreur ajout', error: error.errors || error.message });
  }
};

// UPDATE an existing service
exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Service introuvable' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur mise à jour', error: error.errors || error.message });
  }
};

// DELETE a service
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service introuvable' });
    res.json({ message: 'Service supprimé avec succès', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression', error: error.message });
  }
};
