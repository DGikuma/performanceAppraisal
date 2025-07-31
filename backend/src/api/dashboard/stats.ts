import { NextApiResponse } from 'next';
import { protect, AuthenticatedNextApiRequest } from '../../middleware/authMiddleware';
import { ROLES } from '../../models/UserModel';
import { db } from '../../config/db';

const handler = async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const totalEmployeesResult = await db.query('SELECT COUNT(*) FROM users');
      const totalDepartmentsResult = await db.query('SELECT COUNT(DISTINCT department) FROM users');
      const completedAppraisalsResult = await db.query('SELECT COUNT(*) FROM appraisals WHERE status = $1', ['completed']);
      const pendingAppraisalsResult = await db.query('SELECT COUNT(*) FROM appraisals WHERE status != $1', ['completed']);
      
      const recentUsersResult = await db.query('SELECT id, name, email, department, role, created_at FROM users ORDER BY created_at DESC LIMIT 5');
      
      const departmentStatsResult = await db.query(`
        SELECT 
          u.department, 
          COUNT(u.id) as employees, 
          COALESCE(ROUND((SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) * 100.0) / COUNT(u.id)), 0) as completionRate,
          COALESCE(ROUND(AVG(a.performance_rating), 1), 0) as avgRating
        FROM users u
        LEFT JOIN appraisals a ON u.id = a.employee_id
        GROUP BY u.department
      `);

      res.status(200).json({
        systemStats: {
          totalEmployees: totalEmployeesResult.rows[0].count,
          totalDepartments: totalDepartmentsResult.rows[0].count,
          completedAppraisals: completedAppraisalsResult.rows[0].count,
          pendingAppraisals: pendingAppraisalsResult.rows[0].count,
        },
        recentUsers: recentUsersResult.rows,
        departmentStats: departmentStatsResult.rows,
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

export default function (req: AuthenticatedNextApiRequest, res: NextApiResponse) {
  return protect([ROLES.ADMIN], req, res, handler);
}