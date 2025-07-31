import express from "express";
import { db } from "../config/db";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET all departments
router.get("/", protect(["admin", "supervisor"]), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        d.id, 
        d.name, 
        d.head,
        COALESCE(
          (SELECT COUNT(*) FROM users u WHERE LOWER(u.department) = LOWER(d.name)),
          0
        ) AS total_employees
      FROM departments d
      ORDER BY d.name ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Failed to fetch departments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update department
router.put("/:id", protect(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { name, head } = req.body;

  if (!name || !head) {
    return res.status(400).json({ message: "Name and head are required" });
  }

  try {
    const result = await db.query(
      `UPDATE departments SET name = $1, head = $2 WHERE id = $3 RETURNING *`,
      [name, head, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated", department: result.rows[0] });
  } catch (err) {
    console.error("Failed to update department:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
