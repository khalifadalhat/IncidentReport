const Message = require("../models/Message");
const Case = require("../models/case");

exports.getMessages = async (req, res) => {
  const { caseId } = req.params;
  const messages = await Message.find({ case: caseId }).sort({ timestamp: 1 });
  res.json({ success: true, messages });
};

exports.sendMessageHTTP = async (req, res) => {
  res.status(400).json({ error: "Use real-time chat" });
};
