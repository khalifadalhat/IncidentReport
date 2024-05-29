const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');
const caseRoutes = require('./routes/caseRoutes');
const agentRoutes = require('./routes/agentRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/cases', caseRoutes);
app.use('/agents', agentRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  
  Message.find()
    .then((messages) => {
      socket.emit('initialMessages', messages);
    })
    .catch((error) => {
      console.error('Error fetching initial messages:', error);
    });

  
  socket.on('sendMessage', async (msg) => {
    try {
      const message = new Message(msg);
      await message.save();
      io.emit('receiveMessage', message); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

 
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
