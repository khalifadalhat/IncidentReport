const Agent = require("../models/agent");
const authMiddleware = require('../middleware/authMiddleware');

exports.createAgent = [
  authMiddleware,
  async (req, res) => {
    try {
      const { fullname, email, department, role } = req.body;
      const newAgent = new Agent({ fullname, email, department, role });
      await newAgent.save();
      res.status(201).json({ agent: newAgent });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

exports.getAgents = [
  authMiddleware,
  async (req, res) => {
    try {
      const agents = await Agent.find();
      res.status(200).json({ agents });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

exports.getAgentById = [
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const agent = await Agent.findById(id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.status(200).json({ agent });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

exports.updateAgent = [
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fullname, email, department, role } = req.body;
      const updatedAgent = await Agent.findByIdAndUpdate(
        id,
        { fullname, email, department, role },
        { new: true }
      );
      res.status(200).json({ agent: updatedAgent });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

exports.deleteAgent = [
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      await Agent.findByIdAndDelete(id);
      res.status(200).json({ message: 'Agent deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];
