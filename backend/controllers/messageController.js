const Message = require("../models/Message");
const Case = require("../models/case");

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, text, caseId, recipient } = req.body;

    if (!sender || !text || !caseId) {
      return res.status(400).json({
        error: "Missing required fields: sender, text, caseId",
      });
    }

    const relatedCase = await Case.findById(caseId);
    if (!relatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const newMessage = new Message({
      sender,
      text,
      case: caseId,
      recipient,
      timestamp: new Date(),
    });

    await newMessage.save();

    await Case.findByIdAndUpdate(caseId, {
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: newMessage,
    });

    if (req.io) {
      req.io.to(caseId).emit("receiveMessage", newMessage);
    }
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({
      error: "Server error while sending message",
      details: err.message,
    });
  }
};

// Get messages for a case
exports.getMessages = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ case: caseId })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalMessages = await Message.countDocuments({ case: caseId });

    res.status(200).json({
      success: true,
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasNext: page * limit < totalMessages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({
      error: "Server error while fetching messages",
      details: err.message,
    });
  }
};

// Get initial messages
exports.getInitialMessages = async (caseId) => {
  try {
    return await Message.find({ case: caseId })
      .sort({ timestamp: 1 })
      .limit(50);
  } catch (err) {
    console.error("Error fetching initial messages:", err);
    return [];
  }
};

// Get message statistics for a case
exports.getMessageStats = async (req, res) => {
  try {
    const { caseId } = req.params;

    const stats = await Message.aggregate([
      { $match: { case: mongoose.Types.ObjectId(caseId) } },
      {
        $group: {
          _id: "$sender",
          messageCount: { $sum: 1 },
          lastMessage: { $max: "$timestamp" },
        },
      },
    ]);

    const totalMessages = await Message.countDocuments({ case: caseId });

    res.status(200).json({
      success: true,
      stats,
      totalMessages,
    });
  } catch (err) {
    console.error("Error fetching message stats:", err);
    res.status(500).json({
      error: "Server error while fetching message stats",
      details: err.message,
    });
  }
};

// Search messages by text
exports.searchMessages = async (req, res) => {
  try {
    const { q, caseId } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchFilter = {
      text: { $regex: q, $options: "i" },
    };

    if (caseId) {
      searchFilter.case = caseId;
    }

    const messages = await Message.find(searchFilter)
      .populate("case", "customerName department status")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalResults = await Message.countDocuments(searchFilter);

    res.status(200).json({
      success: true,
      messages,
      searchQuery: q,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResults / limit),
        totalResults,
        hasNext: page * limit < totalResults,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("Error searching messages:", err);
    res.status(500).json({
      error: "Server error while searching messages",
      details: err.message,
    });
  }
};

// Mark messages as read
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { messageIds } = req.body;

    let updateFilter = { case: caseId };

    if (messageIds && messageIds.length > 0) {
      updateFilter._id = { $in: messageIds };
    }

    const result = await Message.updateMany(updateFilter, { read: true });

    res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: "Messages marked as read",
    });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({
      error: "Server error while marking messages as read",
      details: err.message,
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { recipient } = req.query;

    const filter = { case: caseId, read: false };

    if (recipient) {
      filter.recipient = recipient;
    }

    const unreadCount = await Message.countDocuments(filter);

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({
      error: "Server error while fetching unread count",
      details: err.message,
    });
  }
};

// Recent messages across all cases for a user
exports.getRecentMessages = async (req, res) => {
  try {
    const { userId, userType } = req.query;
    const { limit = 10 } = req.query;

    let caseFilter = {};

    if (userType === "customer") {
      caseFilter.customer = userId;
    } else if (userType === "agent") {
      caseFilter.assignedAgent = userId;
    }

    // Get cases for the user
    const cases = await Case.find(caseFilter).select("_id");
    const caseIds = cases.map((c) => c._id);

    // Get recent messages from these cases
    const messages = await Message.find({ case: { $in: caseIds } })
      .populate("case", "customerName department status")
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (err) {
    console.error("Error fetching recent messages:", err);
    res.status(500).json({
      error: "Server error while fetching recent messages",
      details: err.message,
    });
  }
};

module.exports = exports;
