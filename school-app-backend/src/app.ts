import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRouter from './routes/auth';
import gradeRoutes from './routes/grades';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/grades', gradeRoutes);
app.use('/auth', authRouter);

app.get('/', (_req, res) => {
    res.send('Backend is working!');
  });

app.listen(4000, () => console.log('🚀 Server ready at http://localhost:4000'));


export default app;
