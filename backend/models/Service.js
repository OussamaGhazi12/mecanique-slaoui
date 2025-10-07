// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  image:      { type: String, required: true },
  title:      { type: String, required: true },
  description:{ type: String, required: true },
  category:   { type: String, required: true },
  details:    [{ type: String, required: true }],
  serviceImages:[{ type: String, required: true }]
}, {
  timestamps: true // createdAt / updatedAt
});

module.exports = mongoose.model('Service', serviceSchema);
