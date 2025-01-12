const Message = require('../models/Message');

exports.getMessages = [
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


