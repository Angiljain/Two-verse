import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import path from 'path';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Start DB connection
connectDB();

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/memories', memoryRoutes);

// Static uploads folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Socket.io integration
io.on('connection', (socket) => {
  console.log('User connected via socket:', socket.id);

  socket.on('join_couple_room', (coupleId) => {
    socket.join(coupleId);
    console.log(`User joined room: ${coupleId}`);
  });

  socket.on('send_message', (messageData) => {
    io.to(messageData.coupleId).emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
