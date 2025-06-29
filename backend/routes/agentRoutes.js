const express = require('express');
const router = express.Router();
const {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  resetAgentPassword,
} = require('../controllers/agentController');

// Agent routes
router.post('/', createAgent);
router.get('/', getAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);
router.post('/:id/reset-password', resetAgentPassword);

module.exports = router;
