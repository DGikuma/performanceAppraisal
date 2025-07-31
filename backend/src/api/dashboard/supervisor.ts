import { NextApiResponse } from 'next';
import { protect } from '../../middleware/authMiddleware';
import { ROLES } from '../../models/UserModel';
import { AuthenticatedNextApiRequest } from '../../types/AuthenticatedNextApiRequest';
import { db } from '../../config/db'; 

const handler = async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const user = req.user;
      if (!user || user.role !== ROLES.SUPERVISOR) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const pendingAppraisalsResult = await db.query(
        `SELECT a.*, u.name as employee_name, u.position FROM appraisals a 
         JOIN users u ON a.employee_id = u.id 
         WHERE u.department = $1 AND a.status != 'completed'`,
        [user.department]
      );

      const teamMembersResult = await db.query('SELECT id, name, position, avatar FROM users WHERE department = $1', [user.department]);

      const departmentStatsResult = await db.query(
        `SELECT 
           COUNT(*) as teamSize,
           (SELECT COUNT(*) FROM appraisals a JOIN users u ON a.employee_id = u.id WHERE u.department = $1 AND a.status = 'completed') as completedAppraisals,
           (SELECT COUNT(*) FROM appraisals a JOIN users u ON a.employee_id = u.id WHERE u.department = $1 AND a.status != 'completed') as pendingAppraisals,
           (SELECT ROUND(AVG(performance_rating), 1) FROM appraisals a JOIN users u ON a.employee_id = u.id WHERE u.department = $1) as averageRating
         FROM users WHERE department = $1`,
        [user.department]
      );

      res.status(200).json({
        pendingAppraisals: pendingAppraisalsResult.rows,
        teamMembers: teamMembersResult.rows,
        departmentStats: departmentStatsResult.rows[0],
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

export default protect([ROLES.SUPERVISOR]);

