
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',         
    required: true,
  },
  senderRole: {           
    type: String,
    enum: ['customer', 'agent'],
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  recipientRole: {
    type: String,
    enum: ['customer', 'agent'],
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

MessageSchema.index({ case: 1, timestamp: -1 });      
MessageSchema.index({ recipient: 1, read: 1 });        
MessageSchema.index({ case: 1, read: 1 });
MessageSchema.index({ sender: 1, timestamp: -1 });

module.exports = mongoose.model('Message', MessageSchema);