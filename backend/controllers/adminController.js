const User = require("../models/user");
const Case = require("../models/case");
const Message = require("../models/Message");

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "agent" }),
      User.countDocuments({ role: { $in: ["admin", "supervisor"] } }),
      Case.countDocuments(),
      Case.countDocuments({ status: "pending" }),
      Case.countDocuments({ status: "active" }),
      Case.countDocuments({ status: "resolved" }),
      Case.countDocuments({ status: "rejected" }),
      Message.countDocuments(),
    ]);

    const [
      totalCustomers,
      totalAgents,
      totalAdmins,
      totalCases,
      pendingCases,
      activeCases,
      resolvedCases,
      rejectedCases,
      totalMessages,
    ] = stats;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCases = await Case.countDocuments({
      createdAt: { $gte: today },
    });
    const todayMessages = await Message.countDocuments({
      timestamp: { $gte: today },
    });

    res.json({
      success: true,
      stats: {
        users: {
          customers: totalCustomers,
          agents: totalAgents,
          admins: totalAdmins,
        },
        cases: {
          total: totalCases,
          pendingCases,
          activeCases,
          resolvedCases,
          rejectedCases,
        },
        messages: totalMessages,
        today: { newCases: todayCases, newMessages: todayMessages },
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

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

exports.getAllCases = async (req, res) => {
  try {
    const { status, department, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;

    const skip = (page - 1) * limit;

    const cases = await Case.find(filter)
      .populate("customer", "fullname email phone")
      .populate("assignedAgent", "fullname department")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Case.countDocuments(filter);

    res.json({
      success: true,
      cases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};

exports.getAgentPerformance = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select(
      "fullname department"
    );

    const performance = await Promise.all(
      agents.map(async (agent) => {
        const totalCases = await Case.countDocuments({
          assignedAgent: agent._id,
        });
        const resolvedCases = await Case.countDocuments({
          assignedAgent: agent._id,
          status: "resolved",
        });
        const avgResponseTime = await Message.aggregate([
          {
            $match: {
              senderRole: "customer",
              case: {
                $in: await Case.find({ assignedAgent: agent._id }).distinct(
                  "_id"
                ),
              },
            },
          },
          { $sort: { timestamp: 1 } },
          {
            $group: {
              _id: "$case",
              firstCustomerMsg: { $first: "$timestamp" },
            },
          },
          {
            $lookup: {
              from: "messages",
              localField: "_id",
              foreignField: "case",
              as: "agentReplies",
            },
          },
          {
            $project: {
              responseTime: {
                $min: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$agentReplies",
                        cond: { $eq: ["$$this.senderRole", "agent"] },
                      },
                    },
                    as: "reply",
                    in: {
                      $subtract: ["$$reply.timestamp", "$firstCustomerMsg"],
                    },
                  },
                },
              },
            },
          },
          { $unwind: "$responseTime" },
          { $group: { _id: null, avg: { $avg: "$responseTime" } } },
        ]);

        return {
          agent: {
            id: agent._id,
            fullname: agent.fullname,
            department: agent.department,
          },
          totalCases,
          resolvedCases,
          resolutionRate:
            totalCases > 0 ? (resolvedCases / totalCases) * 100 : 0,
          avgFirstResponseTime: (avgResponseTime[0]?.avg || 0) / 60000,
        };
      })
    );

    res.json({ success: true, performance });
  } catch (err) {
    console.error("Agent performance error:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role === "admin")
      return res.status(403).json({ error: "Cannot delete admin" });

    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = exports;
