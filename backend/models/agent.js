const mongoose = require('mongoose');

const departmentEnum = ['Funding Wallet', 'Buying Airtime', 'Buying Internet Data', 'E-commerce Section', 'Fraud Related Problems', 'General Services'];
const roleEnum = ['agent', 'supervisor'];

const AgentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, enum: departmentEnum, required: true },
  role: { type: String, enum: roleEnum, default: 'agent' },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Agent', AgentSchema);
