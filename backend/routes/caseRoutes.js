const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

router.post('/cases', caseController.createCase);
router.get('/cases', caseController.getCases);
router.put('/cases/accept/:caseId', caseController.acceptCase);
router.put('/cases/reject/:caseId', caseController.rejectCase);
router.get('/cases/status/:status', caseController.getCasesByStatus);
router.put('/cases/assign', caseController.assignCase);
router.put('/cases/status/:caseId', caseController.updateCaseStatus);
router.get('/cases/agent/:agentId', caseController.getCasesByAgentId);

module.exports = router;
