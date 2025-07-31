import express from "express";
import { db } from "../config/db";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET all employees with supervisor name
router.get("/", protect(["admin", "supervisor"]), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.department, 
        u.role, 
        u.supervisor_id,
        s.name AS supervisor_name,
        u.created_at
      FROM users u
      LEFT JOIN users s ON u.supervisor_id = s.id
      ORDER BY u.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Failed to fetch employees:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update employee info
router.put("/:id", protect(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { name, email, department, role, supervisor_id } = req.body;

  try {
    const result = await db.query(
      `UPDATE users SET name=$1, email=$2, department=$3, role=$4, supervisor_id=$5 WHERE id=$6 RETURNING *`,
      [name, email, department, role, supervisor_id || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated", employee: result.rows[0] });
  } catch (err) {
    console.error("Failed to update employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Assign supervisor
router.put("/:id/assign-supervisor", protect(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { supervisor_id } = req.body;

  console.log("🔁 Assign Supervisor Request:", { id, supervisor_id }); // <-- log incoming data

  try {
    const result = await db.query(
      `UPDATE users SET supervisor_id = $1 WHERE id = $2 RETURNING *`,
      [supervisor_id || null, id]
    );

    if (result.rowCount === 0) {
      console.warn("⚠️ Employee not found for supervisor assignment:", id);
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("✅ Supervisor assigned successfully:", result.rows[0]); // <-- log DB response
    res.status(200).json({ message: "Supervisor assigned", user: result.rows[0] });
  } catch (err) {
    console.error("❌ Failed to assign supervisor:", err); // <-- log error
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE an employee
router.delete("/:id", protect(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted" });
  } catch (err) {
    console.error("Failed to delete employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single employee by ID
router.get("/:id", protect(["admin", "supervisor"]), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT id, name, email, department, role, supervisor_id FROM users WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to fetch employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
