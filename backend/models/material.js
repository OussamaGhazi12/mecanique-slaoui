// models/material.js
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: String,
  img: String,
  stock: Number
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
