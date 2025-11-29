const User = require("../models/user");
const {
  generatePassword,
  sendCredentialsEmail,
} = require("../utils/agentEmail");

exports.createAgent = async (req, res) => {
  try {
    const { fullname, email, department } = req.body;

    if (!fullname || !email || !department) {
      return res
        .status(400)
        .json({ error: "fullname, email, department required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const password = generatePassword();

    const agent = await User.create({
      fullname,
      email: email.toLowerCase(),
      password,
      role: "agent",
      department,
      isFirstLogin: true,
    });

    sendCredentialsEmail(
      agent.email,
      agent.fullname,
      password,
      agent.department
    ).catch((err) => console.error("Email failed (agent created):", err));

    res.status(201).json({
      success: true,
      message: "Agent created successfully",
      agent: {
        id: agent._id,
        fullname: agent.fullname,
        email: agent.email,
        department: agent.department,
      },
    });
  } catch (err) {
    console.error("Create agent error:", err);
    res.status(500).json({ error: "Failed to create agent" });
  }
};

exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const requester = req.user; 

    const allowedFields = {
      admin: ["fullname", "phone", "location", "gender", "department", "role", "isActive", "profileImage", "liveLocation"],
      supervisor: ["fullname", "phone", "location", "gender", "department", "role", "profileImage", "liveLocation"],
      agent: ["fullname", "phone", "location", "gender", "profileImage", "liveLocation"],
      customer: ["fullname", "phone", "location", "gender", "profileImage", "liveLocation"],
    };

    const allowed = allowedFields[requester.role];

    if (!allowed)
      return res.status(403).json({ error: "Unauthorized role" });

    const userId = req.params.id || requester._id; 
    const targetUser = await User.findById(userId);

    if (!targetUser)
      return res.status(404).json({ error: "User not found" });

    if (requester.role !== "admin" && requester.role !== "supervisor") {
      if (requester._id.toString() !== userId.toString()) {
        return res.status(403).json({ error: "You can only update your own profile" });
      }
    }

    if (requester.role === "supervisor" && targetUser.role === "admin") {
      return res.status(403).json({ error: "Supervisors cannot update admin accounts" });
    }

    const filtered = {};
    Object.keys(updates).forEach((key) => {
      if (allowed.includes(key)) filtered[key] = updates[key];
    });

    const updatedUser = await User.findByIdAndUpdate(userId, filtered, { new: true })
      .select("-password -__v");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};


exports.getAgents = async (req, res) => {
  const agents = await User.find({ role: "agent" }).select(
    "fullname email department"
  );
  res.json({ success: true, agents });
};

module.exports = exports;
