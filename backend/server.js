// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Charger les variables d'environnement

const app = express();
// server.js (ajoute ceci avant les routes)
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(express.json());  // Pour analyser les requêtes en JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Pour autoriser les requêtes cross-origin

// Routes
const authRoute = require('./routes/auth');
const privateRoute = require('./routes/private');
const productRoutes = require('./routes/products');
const serviceRoutes = require('./routes/services');
const reservationRoutes = require('./routes/reservations');
const locationRoutes = require('./routes/locationRoutes');  // Assurer que c'est bien importé
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');  // Ajouter cette ligne pour les avis
const contactRouter = require('./routes/contactRouter');
const topReviewsRouter = require('./routes/topReviewsRouter');
const userRoutes = require('./routes/userRoutes'); // Importer les routes utilisateur
const bestSellingRouter = require('./routes/bestSellingRouter');
const adminRoutes = require('./routes/admin');



const clientRoutes = require('./routes/admin/clients');
const adminProductRoutes = require('./routes/admin/products');
const adminOrdersRoutes = require('./routes/admin/orders');
const adminReservationRoutes = require('./routes/admin/reservations');
const reviewAdminRoutes = require('./routes/admin/reviews');
const adminContactsRoute = require('./routes/admin/contacts');
const adminLocationRoutes = require('./routes/admin/locations'); 
const profileRoutes = require('./routes/admin/profiles');
const adminSettingRoutes = require('./routes/admin/adminSetting');
const materialRoutes = require('./routes/admin/Materials');

// Utilisation des routes
app.use('/api/auth', authRoute);
app.use('/api/private', privateRoute);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);  
app.use('/api/reservations', reservationRoutes);
app.use('/api/location', locationRoutes);  // Assurer que la route est bien incluse
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);  // Ajouter cette ligne pour les avis
app.use('/api', contactRouter);
app.use('/api/top-reviews', topReviewsRouter);
app.use('/api/users', userRoutes); // Ajouter cette ligne pour les routes utilisateur
app.use('/api/best-selling', bestSellingRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/clients', clientRoutes);
app.use('/api/admin/products', adminProductRoutes); // Ajouter les routes admin pour les produits
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/reservations', adminReservationRoutes);
app.use('/api/admin/reviews', reviewAdminRoutes);
app.use('/api/admin/contacts', adminContactsRoute);
app.use('/api/admin/locations', adminLocationRoutes); // Ajouter les routes admin pour les locations
app.use('/api/admin/profiles', profileRoutes);
app.use('/api/admin', adminSettingRoutes);
app.use('/admin/materials', materialRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB - mecanique-slaoui");
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
