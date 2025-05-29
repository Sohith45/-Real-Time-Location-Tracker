import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth';
import orderRoutes from './routes/order';
import locationRoutes from './routes/location';
import { configureSockets } from './sockets';

const app = express();
const server = http.createServer(app);

// Configure CORS for both Express and Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Express middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/realtime-location')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/location', locationRoutes);

// Socket.IO configuration
configureSockets(io);

// Add test route
app.get('/api/test', (_, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});