const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/agents', agentController.createAgent);
router.get('/agents', agentController.getAgents);
router.get('/agents/:id', agentController.getAgentById);
router.put('/agents/:id', agentController.updateAgent);
router.delete('/agents/:id', agentController.deleteAgent);

module.exports = router;
