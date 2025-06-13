
import express from 'express';
import prisma from '../../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET all grades
router.get('/', authenticateToken, async (_req:AuthRequest, res) => {
  const grades = await prisma.grade.findMany();
  res.json(grades);
});

// POST a new grade
router.post('/', async (req, res) => {
  const { student, subject, score } = req.body;
  const grade = await prisma.grade.create({
    data: { student, subject, score },
  });
  res.status(201).json(grade);
});

export default router;
