import { Request, Response } from 'express';
import { createAppraisal, getAllAppraisals } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { ROLES } from '../models/UserModel';

export const appraisalHandler = [
  protect([ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.EMPLOYEE]),

  async (req: Request, res: Response) => {
    if (req.method === 'POST') {
      return createAppraisal(req, res);
    }
    if (req.method === 'GET') {
      return getAllAppraisals(req, res);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
];
