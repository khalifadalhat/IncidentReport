const express = require('express');
const { createCase, getCases, getCasesByStatus, assignCase, updateCaseStatus, getCasesByAgentId, rejectCase, acceptCase } = require('../controllers/caseController');

const router = express.Router();

router.post('/', createCase);
router.get('/', getCases);
router.get('/:status', getCasesByStatus);
router.put('/:caseId/assign', assignCase);
router.put('/:caseId/accept', acceptCase);
router.put('/:caseId/accept', rejectCase);
router.put('/:caseId/status', updateCaseStatus);
router.get('/agent/:agentId', getCasesByAgentId);

module.exports = router;
