const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const departmentEnum = [
  'Funding Wallet',
  'Buying Airtime',
  'Buying Internet Data',
  'E-commerce Section',
  'Fraud Related Problems',
  'General Services',
];
const roleEnum = ['agent', 'supervisor'];

const AgentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, enum: departmentEnum, required: true },
  role: { type: String, enum: roleEnum, default: 'agent' },
  status: { type: String, default: 'active' },
  isFirstLogin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
AgentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
AgentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Agent', AgentSchema);
