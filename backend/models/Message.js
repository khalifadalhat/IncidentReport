const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  recipient: { type: String },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
