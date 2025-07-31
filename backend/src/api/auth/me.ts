import { Response, Request } from 'express';
import {
  protect,
} from '../../middleware/authMiddleware';

// Define AuthenticatedRequest if not already defined elsewhere
interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with your actual user type if available
}

const allowedRoles = ['admin', 'employee', 'supervisor'];

const getProfile = (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ user: req.user });
};

const handler = (req: AuthenticatedRequest, res: Response) => {
  return protect(allowedRoles)(req, res, () => getProfile(req, res));
};

export default handler;