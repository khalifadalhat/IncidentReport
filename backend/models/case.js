const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Funding Wallet', 
      'Buying Airtime', 
      'Buying Internet Data',
      'E-commerce Section',
      'Fraud Related Problems',
      'General Services'
    ]
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'resolved', 'rejected'],
    default: 'pending'
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

CaseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Case', CaseSchema);