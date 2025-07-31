import express from "express";
import { protect } from "../middleware/authMiddleware"; // adjust if needed
import { db } from "../config/db"; // your PostgreSQL connection

const router = express.Router();

router.get("/stats", protect(["admin"]), async (req, res) => {
  try {
    // Query system stats
    const totalEmployeesResult = await db.query("SELECT COUNT(*) FROM users");
    const totalDepartmentsResult = await db.query("SELECT COUNT(DISTINCT department) FROM users");
    const completedAppraisalsResult = await db.query("SELECT COUNT(*) FROM appraisals WHERE status = $1", ['completed']);
    const pendingAppraisalsResult = await db.query("SELECT COUNT(*) FROM appraisals WHERE status != $1", ['completed']);

    // Query recent users
    const recentUsersResult = await db.query(`
      SELECT id, name, email, department, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Query department stats
    const departmentStatsResult = await db.query(`
    SELECT 
        u.department,
        COUNT(DISTINCT u.id) AS employees,
        COALESCE(ROUND(SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT u.id), 0), 0) AS completionrate,
        COALESCE(ROUND(AVG(pr.rating)::numeric, 1), 0) AS avgrating
    FROM users u
    LEFT JOIN appraisals a ON u.id = a.employee_id
    LEFT JOIN performance_ratings pr ON a.id = pr.appraisal_id
    GROUP BY u.department
    `);

    // Send combined response
    res.status(200).json({
      systemStats: {
        totalemployees: parseInt(totalEmployeesResult.rows[0].count),
        totaldepartments: parseInt(totalDepartmentsResult.rows[0].count),
        completedappraisals: parseInt(completedAppraisalsResult.rows[0].count),
        pendingappraisals: parseInt(pendingAppraisalsResult.rows[0].count),
      },
      recentUsers: recentUsersResult.rows,
      departmentStats: departmentStatsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/activity", protect(["admin"]), async (req, res) => {
  try {
    const appraisalActivity = await db.query(`
      SELECT 
        a.id,
        u.name AS employee_name,
        a.status,
        a.updated_at
      FROM appraisals a
      JOIN users u ON a.employee_id = u.id
      ORDER BY a.updated_at DESC
      LIMIT 10
    `);

    const userActivity = await db.query(`
      SELECT 
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({
      appraisals: appraisalActivity.rows,
      users: userActivity.rows,
    });
  } catch (err) {
    console.error("Error fetching system activity:", err);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
});

export default router;
