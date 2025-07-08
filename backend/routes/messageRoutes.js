const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Send message to a case
router.post('/messages', authMiddleware(), messageController.sendMessage);

// Get all messages for a specific case
router.get('/cases/:caseId/messages', authMiddleware(), messageController.getMessages);

// Get initial messages (for socket.io connection)
router.get('/messages/initial/:caseId', authMiddleware(), async (req, res) => {
  const messages = await messageController.getInitialMessages(req.params.caseId);
  res.json({ messages });
});

module.exports = router;
