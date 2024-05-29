const Case = require('../models/case');

exports.createCase = async (req, res) => {
  console.log('Request Body:', req.body);
  const { customerName, issue, department, location} = req.body;

  
  if (!customerName || !issue || !department || !location ) {
    return res.status(400).json({ error: 'Please include all fields: customerName, issue, department, location' });
  }

  try {
    const newCase = new Case({
      customerName,
      issue,
      department,
      location,
      status: 'pending',
      createdAt: Date.now(),
    });

    await newCase.save();
    res.status(201).json({ case: newCase });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate('agent');
    res.status(200).json({ cases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    await Case.findByIdAndUpdate(caseId, { status: 'active' });

    res.status(200).json({ message: 'Case accepted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rejectCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    await Case.findByIdAndUpdate(caseId, { status: 'rejected' });

    res.status(200).json({ message: 'Case rejected successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCasesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const cases = await Case.find({ status }).populate('agent');
    res.status(200).json({ cases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignCase = async (req, res) => {
  try {
    const { caseId, agentId } = req.body;


    await Case.findByIdAndUpdate(caseId, { assignedAgent: agentId });
    
    res.status(200).json({ message: 'Case assigned successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;

    
    await Case.findByIdAndUpdate(caseId, { status });

    res.status(200).json({ message: 'Case status updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCasesByAgentId = async (req, res) => {
  try {
    const { agentId } = req.params;
    const cases = await Case.find({ assignedAgent: agentId }).populate('customer');
    res.status(200).json({ cases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
