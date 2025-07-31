import { NextApiResponse } from 'next';
import { protect } from '../../middleware/authMiddleware';
// Make sure your protect middleware is compatible with Next.js API routes (NextApiRequest, NextApiResponse)
import { NextApiRequest } from 'next';

// Define AuthenticatedNextApiRequest if not exported from authMiddleware
interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: {
    id: string;
    // Add other user properties as needed
  };
}
import { ROLES } from '../../models/UserModel';
import { db } from '../../config/db';

const handler = async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const recentAppraisalsResult = await db.query('SELECT * FROM appraisals WHERE employee_id = $1 ORDER BY created_at DESC LIMIT 3', [user.id]);
      const upcomingAppraisalResult = await db.query('SELECT * FROM appraisals WHERE employee_id = $1 AND status != $2 ORDER BY due_date ASC LIMIT 1', [user.id, 'completed']);
      const goalsResult = await db.query('SELECT * FROM goals WHERE employee_id = $1', [user.id]);

      res.status(200).json({
        recentAppraisals: recentAppraisalsResult.rows,
        upcomingAppraisal: upcomingAppraisalResult.rows[0] || null,
        goals: goalsResult.rows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
const protectedHandler = protect([ROLES.EMPLOYEE]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // If your protect middleware is not compatible with Next.js, you need to update it.
  // Otherwise, cast req and res to 'any' to bypass the type error:
  await (protectedHandler as any)(req, res, async () => {
    // If protect sends a response (e.g., unauthorized), do not continue
    if (res.writableEnded) return;
    return handler(req as AuthenticatedNextApiRequest, res);
  });
};
