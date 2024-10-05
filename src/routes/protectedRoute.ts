import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Protected route
router.get('/', verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Protected route accessed' });
});

export default router;
