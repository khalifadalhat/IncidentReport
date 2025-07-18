const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/cases', authMiddleware(), caseController.createCase);

router.get('/cases/latest/:customerId', authMiddleware(), caseController.getLatestCase);

router.get('/cases', authMiddleware(), caseController.getCases);

router.put('/cases/accept/:caseId', authMiddleware(), caseController.acceptCase);

router.put('/cases/reject/:caseId', authMiddleware(), caseController.rejectCase);

router.put('/cases/assign', authMiddleware(['admin']), caseController.assignCase);

router.put('/cases/status/:caseId', authMiddleware(), caseController.updateCaseStatus);

router.get('/cases/agent/:agentId', authMiddleware(), caseController.getCasesByAgentId);

router.get('/cases/:caseId/messages', authMiddleware(), caseController.getCaseMessages);

module.exports = router;
