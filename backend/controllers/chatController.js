const Case = require("../models/case");
const Message = require("../models/Message");

exports.getChatHistory = async (req, res) => {
  const userId = req.user._id;
  const isCustomer = req.user.role === "customer";

  const cases = await Case.find(
    isCustomer ? { customer: userId } : { assignedAgent: userId }
  )
    .populate(isCustomer ? "assignedAgent" : "customer", "fullname email")
    .sort({ updatedAt: -1 });

  const history = await Promise.all(
    cases.map(async (c) => {
      const lastMsg = await Message.findOne({ case: c._id }).sort({
        timestamp: -1,
      });
      return { case: c, lastMessage: lastMsg };
    })
  );

  res.json({ success: true, history });
};

exports.getCaseChat = async (req, res) => {
  const { caseId } = req.params;
  const userId = req.user._id;

  const caseItem = await Case.findOne({
    _id: caseId,
    $or: [{ customer: userId }, { assignedAgent: userId }],
  }).populate("customer assignedAgent", "fullname email");

  if (!caseItem) return res.status(404).json({ error: "Case not found" });

  const messages = await Message.find({ case: caseId }).sort({ timestamp: 1 });

  res.json({ success: true, case: caseItem, messages });
};
