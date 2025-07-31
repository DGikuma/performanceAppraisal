import { Router } from 'express';
import { login, register, getProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Utility to wrap async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

router.get('/me', protect(['admin', 'employee', 'supervisor']), asyncHandler(getProfile));

export default router;
