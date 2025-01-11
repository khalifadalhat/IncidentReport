const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

exports.getMessages = [
  authMiddleware,
  async (req, res) => {
    const { sender, text, recipient } = req.body;

    try {
      const message = new Message({ sender, text, recipient });
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: 'Error sending message' });
    }
  }
];

exports.sendMessage = [
  authMiddleware,
  async (req, res) => {
    const { sender, text } = req.body;

    try {
      const message = new Message({ sender, text });
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: 'Error sending message' });
    }
  }
];


