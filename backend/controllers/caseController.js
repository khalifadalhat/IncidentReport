const Case = require("../models/case");
const Message = require("../models/Message");
const Agent = require("../models/agent");
const Customer = require("../models/customer");

// Create a new case
exports.createCase = async (req, res) => {
  try {
    const { customerName, issue, department, location, customerId } = req.body;

    if (!customerName || !issue || !department || !location) {
      return res.status(400).json({
        error:
          "Missing required fields: customerName, issue, department, location",
      });
    }

    const newCase = new Case({
      customerName,
      issue,
      department,
      location,
      status: "pending",
      customer: customerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newCase.save();

    // Populate customer details before returning
    const populatedCase = await Case.findById(newCase._id)
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department");

    res.status(201).json({
      success: true,
      case: populatedCase,
      message: "Case created successfully",
    });
  } catch (err) {
    console.error("Error creating case:", err);
    res.status(500).json({
      error: "Server error while creating case",
      details: err.message,
    });
  }
};

// Get latest case for customer
exports.getLatestCase = async (req, res) => {
  try {
    const { customerId } = req.params;

    const latestCase = await Case.findOne({ customer: customerId })
      .sort({ createdAt: -1 })
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department");

    if (!latestCase) {
      return res.status(404).json({
        error: "No cases found for this customer",
      });
    }

    res.status(200).json({
      success: true,
      case: latestCase,
    });
  } catch (err) {
    console.error("Error fetching latest case:", err);
    res.status(500).json({
      error: "Server error while fetching case",
      details: err.message,
    });
  }
};

// Get all cases with filtering options
exports.getCases = async (req, res) => {
  try {
    const { status, department } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;

    const cases = await Case.find(filter)
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({
      error: "Server error while fetching cases",
      details: err.message,
    });
  }
};

// Accept a case (for agents)
exports.acceptCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { agentId } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        status: "active",
        assignedAgent: agentId,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department");

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json({
      success: true,
      case: updatedCase,
      message: "Case accepted successfully",
    });
  } catch (err) {
    console.error("Error accepting case:", err);
    res.status(500).json({
      error: "Server error while accepting case",
      details: err.message,
    });
  }
};

// Update case status
exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "active", "resolved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        status,
        updatedAt: new Date(),
        ...(status === "resolved" && { resolvedAt: new Date() }),
      },
      { new: true }
    )
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department");

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json({
      success: true,
      case: updatedCase,
      message: `Case status updated to ${status}`,
    });
  } catch (err) {
    console.error("Error updating case status:", err);
    res.status(500).json({
      error: "Server error while updating case status",
      details: err.message,
    });
  }
};

// Get cases by agent ID
exports.getCasesByAgentId = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { status } = req.query;

    const filter = { assignedAgent: agentId };
    if (status) filter.status = status;

    const cases = await Case.find(filter)
      .populate("customer", "fullname email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (err) {
    console.error("Error fetching agent cases:", err);
    res.status(500).json({
      error: "Server error while fetching agent cases",
      details: err.message,
    });
  }
};

// Get case messages
exports.getCaseMessages = async (req, res) => {
  try {
    const { caseId } = req.params;

    const messages = await Message.find({ case: caseId }).sort({
      timestamp: 1,
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    console.error("Error fetching case messages:", err);
    res.status(500).json({
      error: "Server error while fetching messages",
      details: err.message,
    });
  }
};

// Assign case to agent
exports.assignCase = async (req, res) => {
  try {
    const { caseId, agentId } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        assignedAgent: agentId,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department");

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json({
      success: true,
      case: updatedCase,
      message: "Case assigned successfully",
    });
  } catch (err) {
    console.error("Error assigning case:", err);
    res.status(500).json({
      error: "Server error while assigning case",
      details: err.message,
    });
  }
};

// Reject a case (agent action)
exports.rejectCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        status: "rejected",
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department");

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json({
      success: true,
      case: updatedCase,
      message: "Case rejected successfully",
    });
  } catch (err) {
    console.error("Error rejecting case:", err);
    res.status(500).json({
      error: "Server error while rejecting case",
      details: err.message,
    });
  }
};

module.exports = exports;
