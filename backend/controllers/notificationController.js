const Notification = require("../models/Notification");


exports.getNotifications = async (req, res) => {
  try {
    const { limit = 20, skip = 0, unreadOnly = false } = req.query;

    const query = { recipient: req.user.userId };
    if (unreadOnly === "true") {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("caseId", "title issue status");

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.userId,
      read: false,
    });

    res.json({
      notifications,
      unreadCount,
      total: await Notification.countDocuments(query),
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.userId,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to get unread count" });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.userId,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

exports.clearReadNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      recipient: req.user.userId,
      read: true,
    });

    res.json({ message: "Read notifications cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};