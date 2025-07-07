const express = require('express');
const router = express.Router();
const chatHistoryController = require('../controllers/chatHistoryController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Customer Routes
router.get('/customer/chat-history', authMiddleware, chatHistoryController.getCustomerChatHistory);
router.get('/customer/case/:caseId/chat', authMiddleware, chatHistoryController.getCustomerCaseChat);

// Agent Routes
router.get('/agent/chat-history', authMiddleware, chatHistoryController.getAgentChatHistory);
router.get('/agent/case/:caseId/chat', authMiddleware, chatHistoryController.getAgentCaseChat);
router.get('/agent/customers', authMiddleware, chatHistoryController.getAgentCustomers);

// Admin Routes
router.get('/admin/chat-history', authMiddleware, chatHistoryController.getAllChatHistory);
router.get('/admin/agent/:agentId/chat-history', authMiddleware, chatHistoryController.getAgentChatHistoryByAdmin);

module.exports = router;