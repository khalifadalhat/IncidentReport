const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  issue: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, default: 'pending' },
  location: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Case', CaseSchema);
