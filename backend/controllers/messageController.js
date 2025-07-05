const Message = require('../models/Message');
const Case = require('../models/case');

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, text, caseId, recipient } = req.body;

    if (!sender || !text || !caseId) {
      return res.status(400).json({ 
        error: 'Missing required fields: sender, text, caseId' 
      });
    }

    const relatedCase = await Case.findById(caseId);
    if (!relatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const newMessage = new Message({
      sender,
      text,
      case: caseId,
      recipient,
      timestamp: new Date()
    });

    await newMessage.save();

    // Update case's last activity timestamp
    await Case.findByIdAndUpdate(caseId, { 
      updatedAt: new Date() 
    });

    res.status(201).json({ 
      success: true,
      message: newMessage 
    });

    // Emit socket event for real-time update
    req.io.to(caseId).emit('receiveMessage', newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ 
      error: 'Server error while sending message',
      details: err.message 
    });
  }
};

// Get messages for a case
exports.getMessages = async (req, res) => {
  try {
    const { caseId } = req.params;

    const messages = await Message.find({ case: caseId })
      .sort({ timestamp: 1 });

    res.status(200).json({ 
      success: true,
      count: messages.length,
      messages 
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ 
      error: 'Server error while fetching messages',
      details: err.message 
    });
  }
};

// Get initial messages (for socket.io connection)
exports.getInitialMessages = async (caseId) => {
  try {
    return await Message.find({ case: caseId })
      .sort({ timestamp: 1 })
      .limit(50);
  } catch (err) {
    console.error('Error fetching initial messages:', err);
    return [];
  }
};