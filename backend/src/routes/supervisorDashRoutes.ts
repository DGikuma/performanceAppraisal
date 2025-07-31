import express from "express";
import { protect } from "../middleware/authMiddleware";
import { db } from "../config/db";
import { ROLES } from "../models/UserModel";

const router = express.Router();

// GET /api/supervisor/supervisor_dashboard
router.get("/supervisor_dashboard", protect([ROLES.SUPERVISOR]), async (req, res) => {
  try {
    const user: any = req.user;

    if (!user || user.role !== ROLES.SUPERVISOR) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { department } = user;

    // Pending Appraisals
    const pendingAppraisals = await db.query(
      `SELECT a.*, u.name AS employee_name, u.position 
       FROM appraisals a 
       JOIN users u ON a.employee_id = u.id 
       WHERE u.department = $1 AND a.status != 'completed'`,
      [department]
    );

    // Team Members
    const teamMembers = await db.query(
      `SELECT id, name, position, avatar FROM users WHERE department = $1`,
      [department]
    );

    // Department Stats
    const departmentStats = await db.query(
      `SELECT 
         COUNT(*) AS teamsize,
         (SELECT COUNT(*) FROM appraisals a 
          JOIN users u ON a.employee_id = u.id 
          WHERE u.department = $1 AND a.status = 'completed') AS completedappraisals,
         (SELECT COUNT(*) FROM appraisals a 
          JOIN users u ON a.employee_id = u.id 
          WHERE u.department = $1 AND a.status != 'completed') AS pendingappraisals,
         (SELECT ROUND(AVG(overall_rating), 1) 
          FROM appraisals a 
          JOIN users u ON a.employee_id = u.id 
          WHERE u.department = $1) AS averagerating
       FROM users WHERE department = $1`,
      [department]
    );

    res.status(200).json({
      pendingAppraisals: pendingAppraisals.rows,
      teamMembers: teamMembers.rows,
      departmentStats: departmentStats.rows[0],
    });
  } catch (error) {
    console.error("Supervisor dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
