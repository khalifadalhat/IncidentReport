const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['customer', 'agent'],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'recipientModel',
    },
    recipientModel: {
      type: String,
      enum: ['customer', 'agent'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
MessageSchema.index({ case: 1, timestamp: 1 });
MessageSchema.index({ recipient: 1, read: 1 });
MessageSchema.index({ sender: 1, timestamp: 1 });

module.exports = mongoose.model('Message', MessageSchema);
