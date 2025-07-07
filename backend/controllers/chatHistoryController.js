const Message = require("../models/Message");
const Case = require("../models/case");
const Agent = require("../models/agent");
const Customer = require("../models/customer");

// Get customer's chat history - all their cases and messages
exports.getCustomerChatHistory = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.customerId;

    // Get all cases for this customer
    const cases = await Case.find({ customer: customerId })
      .populate("assignedAgent", "fullname department")
      .sort({ createdAt: -1 });

    // Get messages for each case
    const chatHistory = await Promise.all(
      cases.map(async (caseItem) => {
        const messages = await Message.find({ case: caseItem._id })
          .sort({ timestamp: 1 })
          .limit(10);

        const messageCount = await Message.countDocuments({
          case: caseItem._id,
        });

        return {
          case: caseItem,
          messages,
          messageCount,
          lastMessage:
            messages.length > 0 ? messages[messages.length - 1] : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      chatHistory,
      totalCases: cases.length,
    });
  } catch (error) {
    console.error("Error fetching customer chat history:", error);
    res.status(500).json({
      error: "Server error while fetching chat history",
      details: error.message,
    });
  }
};

// Get specific case chat for customer
exports.getCustomerCaseChat = async (req, res) => {
  try {
    const { caseId } = req.params;
    const customerId = req.user._id || req.user.customerId;

    // Verify customer owns this case
    const caseItem = await Case.findOne({
      _id: caseId,
      customer: customerId,
    }).populate("assignedAgent", "fullname department");

    if (!caseItem) {
      return res.status(404).json({ error: "Case not found or unauthorized" });
    }

    const messages = await Message.find({ case: caseId }).sort({
      timestamp: 1,
    });

    res.status(200).json({
      success: true,
      case: caseItem,
      messages,
      messageCount: messages.length,
    });
  } catch (error) {
    console.error("Error fetching customer case chat:", error);
    res.status(500).json({
      error: "Server error while fetching case chat",
      details: error.message,
    });
  }
};

// Get agent's chat history - all cases they've handled
exports.getAgentChatHistory = async (req, res) => {
  try {
    const agentId = req.user._id || req.userId;

    // Get all cases assigned to this agent
    const cases = await Case.find({ assignedAgent: agentId })
      .populate("customer", "fullname email phone")
      .sort({ updatedAt: -1 });

    // Get messages for each case
    const chatHistory = await Promise.all(
      cases.map(async (caseItem) => {
        const messages = await Message.find({ case: caseItem._id })
          .sort({ timestamp: 1 })
          .limit(10);

        const messageCount = await Message.countDocuments({
          case: caseItem._id,
        });

        return {
          case: caseItem,
          messages,
          messageCount,
          lastMessage:
            messages.length > 0 ? messages[messages.length - 1] : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      chatHistory,
      totalCases: cases.length,
    });
  } catch (error) {
    console.error("Error fetching agent chat history:", error);
    res.status(500).json({
      error: "Server error while fetching chat history",
      details: error.message,
    });
  }
};

// Get specific case chat for agent
exports.getAgentCaseChat = async (req, res) => {
  try {
    const { caseId } = req.params;
    const agentId = req.user._id || req.userId;

    // Verify agent is assigned to this case
    const caseItem = await Case.findOne({
      _id: caseId,
      assignedAgent: agentId,
    }).populate("customer", "fullname email phone");

    if (!caseItem) {
      return res.status(404).json({ error: "Case not found or unauthorized" });
    }

    const messages = await Message.find({ case: caseId }).sort({
      timestamp: 1,
    });

    res.status(200).json({
      success: true,
      case: caseItem,
      messages,
      messageCount: messages.length,
    });
  } catch (error) {
    console.error("Error fetching agent case chat:", error);
    res.status(500).json({
      error: "Server error while fetching case chat",
      details: error.message,
    });
  }
};

// Get all customers an agent has interacted with
exports.getAgentCustomers = async (req, res) => {
  try {
    const agentId = req.user._id || req.userId;

    // Get unique customers from cases assigned to this agent
    const cases = await Case.find({ assignedAgent: agentId })
      .populate("customer", "fullname email phone location")
      .sort({ updatedAt: -1 });

    // Group by customer and get their interaction summary
    const customerMap = new Map();

    for (const caseItem of cases) {
      const customerId = caseItem.customer._id.toString();

      if (!customerMap.has(customerId)) {
        const messageCount = await Message.countDocuments({
          case: caseItem._id,
        });

        customerMap.set(customerId, {
          customer: caseItem.customer,
          totalCases: 1,
          totalMessages: messageCount,
          lastInteraction: caseItem.updatedAt,
          cases: [caseItem],
        });
      } else {
        const existing = customerMap.get(customerId);
        const messageCount = await Message.countDocuments({
          case: caseItem._id,
        });

        existing.totalCases += 1;
        existing.totalMessages += messageCount;
        existing.cases.push(caseItem);

        if (caseItem.updatedAt > existing.lastInteraction) {
          existing.lastInteraction = caseItem.updatedAt;
        }
      }
    }

    const customers = Array.from(customerMap.values());

    res.status(200).json({
      success: true,
      customers,
      totalCustomers: customers.length,
    });
  } catch (error) {
    console.error("Error fetching agent customers:", error);
    res.status(500).json({
      error: "Server error while fetching customers",
      details: error.message,
    });
  }
};

// Admin route - Get all chat history
exports.getAllChatHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const cases = await Case.find()
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCases = await Case.countDocuments();

    // Get message counts for each case
    const chatHistory = await Promise.all(
      cases.map(async (caseItem) => {
        const messageCount = await Message.countDocuments({
          case: caseItem._id,
        });
        const lastMessage = await Message.findOne({ case: caseItem._id }).sort({
          timestamp: -1,
        });

        return {
          case: caseItem,
          messageCount,
          lastMessage,
        };
      })
    );

    res.status(200).json({
      success: true,
      chatHistory,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCases / limit),
        totalCases,
        hasNext: page * limit < totalCases,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching all chat history:", error);
    res.status(500).json({
      error: "Server error while fetching chat history",
      details: error.message,
    });
  }
};

// Admin route - Get specific agent's chat history
exports.getAgentChatHistoryByAdmin = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Verify agent exists
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const cases = await Case.find({ assignedAgent: agentId })
      .populate("customer", "fullname email phone")
      .sort({ updatedAt: -1 });

    const chatHistory = await Promise.all(
      cases.map(async (caseItem) => {
        const messageCount = await Message.countDocuments({
          case: caseItem._id,
        });
        const lastMessage = await Message.findOne({ case: caseItem._id }).sort({
          timestamp: -1,
        });

        return {
          case: caseItem,
          messageCount,
          lastMessage,
        };
      })
    );

    res.status(200).json({
      success: true,
      agent,
      chatHistory,
      totalCases: cases.length,
    });
  } catch (error) {
    console.error("Error fetching agent chat history:", error);
    res.status(500).json({
      error: "Server error while fetching agent chat history",
      details: error.message,
    });
  }
};


