const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, 
  location: { type: String, required: true },
  gender: { type: String },
});

module.exports = mongoose.model('Customer', CustomerSchema);
