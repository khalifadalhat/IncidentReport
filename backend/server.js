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
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");

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

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api", caseRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api", userRoutes);
app.use("/api", messageRoutes);

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("A user connected");

  Message.find()
    .then((messages) => {
      socket.emit("initialMessages", messages);
    })
    .catch((error) => {
      console.error("Error fetching initial messages:", error);
    });

  socket.on("sendMessage", async (msg) => {
    try {
      const message = new Message(msg);
      await message.save();
      io.emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));