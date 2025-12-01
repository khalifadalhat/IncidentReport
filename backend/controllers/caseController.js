const Case = require("../models/case");
const User = require("../models/user");

exports.createCase = async (req, res) => {
  try {
    const { issue, department, location } = req.body;
    const customerId = req.user._id;

    const newCase = await Case.create({
      customer: customerId,
      customerName: req.user.fullname || req.user.email.split("@")[0],
      issue,
      department,
      location,
      status: "pending",
    });

    const populatedCase = await Case.findById(newCase._id)
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department");

    res.status(201).json({
      success: true,
      case: populatedCase,
    });
  } catch (err) {
    console.error("Create case error:", err);
    res.status(500).json({ error: "Failed to create case" });
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const skip = (page - 1) * limit;

    const users = await Case.find(filter)
      .populate("assignedAgent", "fullname department")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Case.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getMyCases = async (req, res) => {
  try {
    const { status } = req.query;

    const filter =
      req.user.role === "customer"
        ? { customer: req.user._id }
        : { assignedAgent: req.user._id };

    if (status) {
      filter.status = status;
    }

    const cases = await Case.find(filter)
      .populate("customer", "fullname email")
      .populate("assignedAgent", "fullname department")
      .sort({ updatedAt: -1 });

    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};

exports.acceptCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        assignedAgent: req.user._id,
        status: "active",
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("customer", "fullname email")
      .populate("assignedAgent", "fullname department");

    if (!updatedCase) return res.status(404).json({ error: "Case not found" });

    res.json({ success: true, case: updatedCase });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept case" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "active", "resolved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        status,
        updatedAt: new Date(),
        ...(status === "resolved" && { resolvedAt: new Date() }),
      },
      { new: true }
    ).populate("customer assignedAgent");

    res.json({ success: true, case: updatedCase });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

exports.assignCase = async (req, res) => {
  try {
    const { caseId, agentId } = req.body;

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(400).json({ error: "Invalid agent" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        assignedAgent: agentId,
        status: "in-progress",
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("customer assignedAgent");

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const io = req.app.get("io");

    await notifyAgentAssigned(io, {
      recipient: updatedCase.customer._id,
      caseId: updatedCase._id,
      agentName:
        updatedCase.assignedAgent.fullname ||
        updatedCase.assignedAgent.email.split("@")[0],
      caseTitle: updatedCase.title || updatedCase.issue,
    });

    await notifyCaseAssigned(io, {
      recipient: agentId,
      caseId: updatedCase._id,
      caseTitle: updatedCase.title || updatedCase.issue,
      customerName:
        updatedCase.customer.fullname ||
        updatedCase.customer.email.split("@")[0],
    });

    res.json({
      success: true,
      case: updatedCase,
    });
  } catch (err) {
    console.error("Assign case error:", err);
    res.status(500).json({ error: "Failed to assign case" });
  }
};
module.exports = exports;
