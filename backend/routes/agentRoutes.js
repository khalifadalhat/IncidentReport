const express = require('express');
const { createAgent, getAgents, updateAgent, deleteAgent, getAgentById } = require('../controllers/agentController');

const router = express.Router();

router.post('/', createAgent);
router.get('/', getAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;
