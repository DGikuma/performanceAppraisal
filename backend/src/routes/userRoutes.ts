import express from "express";
import { db } from "../config/db";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ GET all users (only id & name)
router.get("/", protect(["admin", "supervisor"]), async (req, res) => {
  console.log("🔍 /api/users route hit"); // ✅ This logs every time the route is accessed

  try {
    const result = await db.query("SELECT id, name FROM users ORDER BY name ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET single user by ID
router.get("/users/:id", protect(["admin", "supervisor"]), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, name, email, department, role FROM users WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to fetch user by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
