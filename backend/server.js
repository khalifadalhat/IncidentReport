const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customerRoutes");
const caseRoutes = require("./routes/caseRoutes");
const agentRoutes = require("./routes/agentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");
const Message = require("./models/Message");
const jwt = require("jsonwebtoken");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Socket.IO CORS Config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectDB();

// Token verification helper
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

// Case access verification helper
const verifyCaseAccess = async (userId, caseId) => {
  try {
    const Case = require("./models/case");
    const case_ = await Case.findById(caseId);

    if (!case_) return false;

    // Check if user is the customer or assigned agent
    return (
      case_.customer.toString() === userId ||
      (case_.assignedAgent && case_.assignedAgent.toString() === userId)
    );
  } catch (error) {
    console.error("Error verifying case access:", error);
    return false;
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api", caseRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api", userRoutes);
app.use("/api", messageRoutes);
app.use("/api", chatHistoryRoutes); 

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.use((packet, next) => {
    const token = socket.handshake.auth.token;
    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.decoded = decoded;
    next();
  });

  socket.on("joinCase", async (caseId) => {
    try {
      const hasAccess = await verifyCaseAccess(
        socket.decoded.userId || socket.decoded.customerId,
        caseId
      );
      if (!hasAccess) {
        return socket.emit("error", "Unauthorized case access");
      }

      socket.join(caseId);

      // Get initial messages
      const messageController = require("./controllers/messageController");
      const initialMessages =
        await messageController.getInitialMessages(caseId);
      socket.emit("initialMessages", initialMessages);

      console.log(
        `User ${socket.decoded.userId || socket.decoded.customerId} joined case ${caseId}`
      );
    } catch (error) {
      console.error("Error joining case room:", error);
      socket.emit("error", "Failed to join case");
    }
  });

  socket.on("sendMessage", async (msg) => {
    try {
      if (!msg.sender || !msg.text || !msg.caseId) {
        return socket.emit("error", "Invalid message format");
      }

      // Verify user has access to this case
      const hasAccess = await verifyCaseAccess(
        socket.decoded.userId || socket.decoded.customerId,
        msg.caseId
      );
      if (!hasAccess) {
        return socket.emit("error", "Unauthorized case access");
      }

      // Create and save message
      const newMessage = new Message({
        sender: msg.sender,
        text: msg.text,
        case: msg.caseId,
        recipient: msg.recipient,
        timestamp: new Date(),
      });

      await newMessage.save();

      const Case = require("./models/case");
      await Case.findByIdAndUpdate(msg.caseId, { updatedAt: new Date() });

      io.to(msg.caseId).emit("receiveMessage", newMessage);

      console.log(`Message sent in case ${msg.caseId} by ${msg.sender}`);
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("markAsRead", async (data) => {
    try {
      const { caseId, messageIds } = data;

      const hasAccess = await verifyCaseAccess(
        socket.decoded.userId || socket.decoded.customerId,
        caseId
      );
      if (!hasAccess) {
        return socket.emit("error", "Unauthorized case access");
      }

      let updateFilter = { case: caseId };
      if (messageIds && messageIds.length > 0) {
        updateFilter._id = { $in: messageIds };
      }

      await Message.updateMany(updateFilter, { read: true });

      socket.to(caseId).emit("messagesRead", { caseId, messageIds });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      socket.emit("error", "Failed to mark messages as read");
    }
  });

  socket.on("leaveCase", (caseId) => {
    socket.leave(caseId);
    console.log(`User left case ${caseId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
