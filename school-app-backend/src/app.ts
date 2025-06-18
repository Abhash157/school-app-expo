import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import gradeRoutes from './routes/grades';
import attendanceRoutes from './routes/attendance';

dotenv.config();

const app = express();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-app';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: '*', // Allow all origins for development; restrict in production
  credentials: true, // Allow credentials if needed
}));

app.use(express.json());

// Routes
app.use('/api/grades', gradeRoutes);
app.use('/api/auth', authRouter);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (_req, res) => {
  res.send('Backend is working!');
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

export default app;
