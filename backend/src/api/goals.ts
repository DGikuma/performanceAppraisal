// pages/api/goals.ts
import { NextApiResponse } from 'next';
import { createGoal, getGoals } from '../controllers/goalController';
import { NextApiRequest } from 'next';
import { protect } from '../middleware/authMiddleware';
import { ROLES } from '../models/UserModel';
import { AuthenticatedNextApiRequest } from '../types/AuthenticatedNextApiRequest';
const handler = async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return createGoalNext(req, res);
  }

  if (req.method === 'GET') {
    return getGoalsNext(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

// Adapter to call Express-style controller in Next.js API route
const getGoalsNext = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  return getGoals(req, res);
};

const createGoalNext = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  return createGoal(req, res);
};

// For Next.js API routes, wrap the handler inside a function that passes all required arguments
const protectedHandler = (req: NextApiRequest, res: NextApiResponse) =>
  protect([ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.EMPLOYEE], req, res, handler);

export default protectedHandler;