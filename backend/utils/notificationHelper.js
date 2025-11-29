
const Notification = require("../models/Notification");

const createNotification = async (io, data) => {
  try {
    const {
      recipient,
      type,
      title,
      message,
      caseId,
      metadata = {},
    } = data;


    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      caseId,
      metadata,
      read: false,
    });

    if (io && recipient) {
      io.to(recipient.toString()).emit("notification", {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        caseId: notification.caseId,
        metadata: notification.metadata,
        read: notification.read,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
};

const notifyNewMessage = async (io, { recipient, caseId, messageText, senderName }) => {
  return createNotification(io, {
    recipient,
    type: "new_message",
    title: "New Message",
    message: `${senderName}: ${messageText.substring(0, 50)}${messageText.length > 50 ? "..." : ""}`,
    caseId,
    metadata: { senderName },
  });
};


const notifyAgentAssigned = async (io, { recipient, caseId, agentName, caseTitle }) => {
  return createNotification(io, {
    recipient,
    type: "agent_assigned",
    title: "Agent Assigned",
    message: `${agentName} has been assigned to your case: "${caseTitle}"`,
    caseId,
    metadata: { agentName, caseTitle },
  });
};


const notifyCaseAssigned = async (io, { recipient, caseId, customerName, caseTitle }) => {
  return createNotification(io, {
    recipient,
    type: "case_assigned",
    title: "New Case Assigned",
    message: `New case assigned: "${caseTitle}" from ${customerName}`,
    caseId,
    metadata: { customerName, caseTitle },
  });
};

const notifyCaseStatusUpdate = async (io, { recipient, caseId, status, caseTitle }) => {
  return createNotification(io, {
    recipient,
    type: "case_status_updated",
    title: "Case Status Updated",
    message: `Case "${caseTitle}" status changed to: ${status}`,
    caseId,
    metadata: { status, caseTitle },
  });
};

module.exports = {
  createNotification,
  notifyNewMessage,
  notifyAgentAssigned,
  notifyCaseAssigned,
  notifyCaseStatusUpdate,
};