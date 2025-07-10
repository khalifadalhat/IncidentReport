const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const customerRoutes = require('./routes/customerRoutes');
const caseRoutes = require('./routes/caseRoutes');
const agentRoutes = require('./routes/agentRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');
const Message = require('./models/Message');
const Case = require('./models/case');
const jwt = require('jsonwebtoken');

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

connectDB();

// Token verification helper
const verifyToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

// Case access verification helper
const verifyCaseAccess = async (userId, caseId) => {
  try {
    const caseData = await Case.findById(caseId);
    if (!caseData) return false;

    // Check if user is the customer, assigned agent, or admin
    return (
      caseData.customer.equals(userId) ||
      (caseData.assignedAgent && caseData.assignedAgent.equals(userId))
    );
  } catch (error) {
    console.error('Error verifying case access:', error);
    return false;
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', caseRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api', userRoutes);
app.use('/api', messageRoutes);
app.use('/api', chatHistoryRoutes);

// Authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO Events
io.on('connection', socket => {
  console.log(`User connected: ${socket.user.userId}`);

  socket.on('joinCase', async caseId => {
    try {
      const hasAccess = await verifyCaseAccess(socket.user.userId, caseId);
      if (!hasAccess) return socket.emit('error', 'Unauthorized access');

      socket.join(caseId);
      const messages = await Message.find({ case: caseId }).sort({ timestamp: 1 }).limit(50);

      socket.emit('initialMessages', messages);
    } catch (error) {
      socket.emit('error', 'Failed to join case');
    }
  });

  socket.on('sendMessage', async msg => {
    try {
      if (!msg.text || !msg.caseId) {
        return socket.emit('error', 'Invalid message format');
      }

      const hasAccess = await verifyCaseAccess(socket.user.userId, msg.caseId);
      if (!hasAccess) return socket.emit('error', 'Unauthorized access');

      const caseData = await Case.findById(msg.caseId);
      const recipient = socket.user.role === 'agent' ? caseData.customer : caseData.assignedAgent;

      console.log('Received message:', msg);

      const newMessage = new Message({
        sender: socket.user.userId,
        senderModel: socket.user.role,
        text: msg.text,
        case: msg.caseId,
        recipient,
        recipientModel: socket.user.role === 'agent' ? 'customer' : 'agent',
        read: socket.user.role === 'agent',
        timestamp: new Date(),
      });

      await newMessage.save();
      await Case.findByIdAndUpdate(msg.caseId, {
        updatedAt: new Date(),
        lastMessage: newMessage._id,
      });

      console.log('Saved message:', newMessage);
      io.to(msg.caseId).emit('receiveMessage', newMessage);

      if (recipient) {
        io.to(recipient).emit('newMessageNotification', {
          caseId: msg.caseId,
          message: newMessage,
        });
      }
    } catch (error) {
      console.error('Message error:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('typing', caseId => {
    socket.to(caseId).emit('userTyping', {
      userId: socket.user.userId,
      name: socket.user.name,
    });
  });

  socket.on('markMessagesRead', async ({ caseId }) => {
    try {
      await Message.updateMany(
        {
          case: caseId,
          recipient: socket.user.userId,
          read: false,
        },
        { $set: { read: true } }
      );

      io.to(caseId).emit('messagesRead', {
        caseId,
        userId: socket.user.userId,
      });
    } catch (error) {
      console.error('Read receipt error:', error);
    }
  });

  socket.on('leaveCase', caseId => {
    socket.leave(caseId);
    console.log(`User left case ${caseId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.userId}`);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
