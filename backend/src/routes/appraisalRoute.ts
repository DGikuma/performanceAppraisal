import express from "express";
import { db } from "../config/db"; // Your PostgreSQL db pool client

const router = express.Router();

// GET all appraisals
router.get("/", async (_req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.id,
        u1.name AS employee_name,
        u2.name AS reviewer_name,
        p.name AS period_name,
        a.status,
        a.overall_rating AS score,
        a.created_at AS date
      FROM appraisals a
      LEFT JOIN users u1 ON u1.id = a.employee_id
      LEFT JOIN users u2 ON u2.id = a.supervisor_id
      LEFT JOIN appraisal_periods p ON p.id = a.period_id
      ORDER BY a.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching appraisals:", error.message);
    res.status(500).json({ message: "Failed to fetch appraisals." });
  }
});

// PUT update score by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  if (score === undefined || score === null) {
    return res.status(400).json({ message: "Score is required." });
  }

  try {
    const result = await db.query(
      `UPDATE appraisals SET overall_rating = $1 WHERE id = $2`,
      [score, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appraisal not found." });
    }

    res.status(200).json({ message: "Score updated successfully." });
  } catch (error) {
    console.error("Error updating appraisal:", error);
    res.status(500).json({ message: "Failed to update score." });
  }
});

export default router;
