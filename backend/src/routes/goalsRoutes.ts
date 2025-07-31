import express from 'express';
import { createGoal, getGoals } from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';
import { ROLES } from '../models/UserModel';

const router = express.Router();

router.post('/goals', protect([ROLES.EMPLOYEE]), createGoal);
router.get('/goals', protect([ROLES.EMPLOYEE, ROLES.SUPERVISOR]), getGoals);

export default router;
