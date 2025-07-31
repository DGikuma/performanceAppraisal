import { Request, Response } from "express";
import { db } from "../../config/db";
import { ROLES } from "../../models/UserModel";

export const getSupervisorDashboard = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;

    if (!user || user.role !== ROLES.SUPERVISOR) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { department } = user;

    // Fetch pending appraisals
    const pendingAppraisals = await db.query(
      `SELECT a.*, u.name AS employee_name, u.position 
       FROM appraisals a 
       JOIN users u ON a.employee_id = u.id 
       WHERE u.department = $1 AND a.status != 'completed'`,
      [department]
    );

    // Fetch team members
    const teamMembers = await db.query(
      `SELECT id, name, position, avatar FROM users WHERE department = $1`,
      [department]
    );

    // Fetch department stats
    const departmentStats = await db.query(
      `SELECT 
         COUNT(*) AS teamSize,
         (SELECT COUNT(*) FROM appraisals a 
          JOIN users u ON a.employee_id = u.id 
          WHERE u.department = $1 AND a.status = 'completed') AS completedAppraisals,
         (SELECT COUNT(*) FROM appraisals a 
          JOIN users u ON a.employee_id = u.id 
          WHERE u.department = $1 AND a.status != 'completed') AS pendingAppraisals,
         (SELECT ROUND(AVG(performance_rating), 1) 
          FROM appraisals a 
          JOIN users u ON a.employee_id = u.id 
          WHERE u.department = $1) AS averageRating
       FROM users WHERE department = $1`,
      [department]
    );

    return res.status(200).json({
      pendingAppraisals: pendingAppraisals.rows,
      teamMembers: teamMembers.rows,
      departmentStats: departmentStats.rows[0],
    });
  } catch (err) {
    console.error("Supervisor dashboard error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
