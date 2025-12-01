const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Message = require("./models/Message");
const Case = require("./models/case");
const User = require("./models/user");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const caseRoutes = require("./routes/caseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const {
  notifyNewMessage,
  notifyAgentAssigned,
  notifyCaseAssigned,
  notifyCaseStatusUpdate,
} = require("./utils/notificationHelper");

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", uploadRoutes);

const swaggerSpecs = require("./swagger");
const swaggerUi = require("swagger-ui-express");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

app.get("/api-docs-json", (req, res) => res.json(swaggerSpecs));
if (process.env.NODE_ENV === "development" || process.env.SWAGGER_ENABLED) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log("🔐 Socket auth attempt, token present:", !!token);

    if (!token) {
      console.log("❌ No token provided");
      return next(new Error("No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded.userId, decoded.role);

    const user = await User.findById(decoded.userId);
    console.log("👤 User found:", !!user, user?.email);

    if (!user || !user.isActive) {
      console.log("❌ Invalid or inactive user");
      return next(new Error("Invalid user"));
    }

    socket.user = {
      userId: user._id.toString(),
      role: user.role,
      fullname: user.fullname || user.email.split("@")[0],
    };

    console.log("✅ Socket authenticated for:", socket.user.fullname);
    next();
  } catch (err) {
    console.error("❌ Socket auth error:", err.message);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.user.userId);

  socket.on("joinCase", async (caseId) => {
    try {
      const caseData = await Case.findById(caseId);
      if (!caseData) return socket.emit("error", "Case not found");

      const isCustomer = caseData.customer.toString() === socket.user.userId;
      const isAgent = caseData.assignedAgent?.toString() === socket.user.userId;

      if (!isCustomer && !isAgent) {
        return socket.emit("error", "Unauthorized");
      }

      socket.join(caseId);

      const messages = await Message.find({ case: caseId })
        .sort({ timestamp: 1 })
        .limit(50);

      socket.emit("initialMessages", messages);
    } catch (err) {
      socket.emit("error", "Failed to join case");
    }
  });

  socket.on("updateCaseStatus", async ({ caseId, status }) => {
    try {
      const caseData = await Case.findById(caseId);
      if (!caseData) return socket.emit("error", "Case not found");

      const isAgent = caseData.assignedAgent?.toString() === socket.user.userId;
      const isAdmin = socket.user.role === "admin";

      if (!isAgent && !isAdmin) {
        return socket.emit("error", "Unauthorized");
      }

      await Case.findByIdAndUpdate(caseId, {
        status,
        updatedAt: new Date(),
      });

      await notifyCaseStatusUpdate(io, {
        recipient: caseData.customer.toString(),
        caseId,
        status,
        caseTitle: caseData.title,
      });

      if (
        caseData.assignedAgent &&
        caseData.assignedAgent.toString() !== socket.user.userId
      ) {
        await notifyCaseStatusUpdate(io, {
          recipient: caseData.assignedAgent.toString(),
          caseId,
          status,
          caseTitle: caseData.title,
        });
      }

      socket.emit("statusUpdateSuccess", { caseId, status });
    } catch (err) {
      console.error("Status update error:", err);
      socket.emit("error", "Failed to update status");
    }
  });

  socket.on("sendMessage", async ({ caseId, text }) => {
    try {
      if (!text?.trim()) return;

      const caseData = await Case.findById(caseId);
      if (!caseData) return;

      const isCustomer = caseData.customer.toString() === socket.user.userId;
      const isAgent = caseData.assignedAgent?.toString() === socket.user.userId;
      if (!isCustomer && !isAgent) return;

      let recipientId = null;
      let recipientRole = null;

      if (isCustomer) {
        recipientId = caseData.assignedAgent?.toString() || null;
        recipientRole = "agent";
      } else if (isAgent) {
        recipientId = caseData.customer.toString();
        recipientRole = "customer";
      }

      const message = await Message.create({
        case: caseId,
        sender: socket.user.userId,
        senderRole: socket.user.role,
        recipient: recipientId,
        recipientRole: recipientRole,
        text: text.trim(),
        read: isAgent,
      });

      await Case.findByIdAndUpdate(caseId, {
        updatedAt: new Date(),
        lastMessage: message._id,
      });

      const messageData = {
        _id: message._id.toString(),
        case: message.case.toString(),
        sender: message.sender.toString(),
        senderRole: message.senderRole,
        recipient: message.recipient?.toString() || null,
        recipientRole: message.recipientRole,
        text: message.text,
        read: message.read,
        timestamp: message.timestamp || message.createdAt,
      };

      io.to(caseId).emit("receiveMessage", message);

      if (recipientId) {
        await notifyNewMessage(io, {
          recipient: recipientId,
          caseId,
          messageText: text.trim(),
          senderName: socket.user.fullname,
        });
      }
    } catch (err) {
      console.error("Send message error:", err);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("typing", ({ caseId, isTyping }) => {
    socket.to(caseId).emit("userTyping", {
      userId: socket.user.userId,
      fullname: socket.user.fullname,
      isTyping,
    });
  });

  socket.on("markAsRead", async (caseId) => {
    await Message.updateMany(
      { case: caseId, recipient: socket.user.userId, read: false },
      { read: true }
    );
    io.to(caseId).emit("messagesRead", { userId: socket.user.userId });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.fullname}`);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
