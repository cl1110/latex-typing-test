import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import resultRoutes from './routes/results';
import equationRoutes from './routes/equations';
import leaderboardRoutes from './routes/leaderboard';
import { setupMultiplayer } from './services/multiplayer';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});


app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/latex-typing-test');



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/equations', equationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


setupMultiplayer(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


