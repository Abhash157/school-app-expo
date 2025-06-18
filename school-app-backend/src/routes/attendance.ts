import { Router, Request, Response, NextFunction } from 'express';
import { getMonthlyAttendance, generateTestData } from '../controllers/attendanceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get monthly attendance for a user
router.get('/:userId/monthly/:year/:month', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  getMonthlyAttendance(req, res).catch(next);
});

// Generate test data (for development only)
router.post('/test-data/:userId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await generateTestData(req.params.userId);
    res.json(result);
  } catch (error) {
    console.error('Error generating test data:', error);
    res.status(500).json({ message: 'Error generating test data' });
  }
});

export default router;
