import express from "express";
import { db } from "../../config/db";
import { protect } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect(["admin", "supervisor"]), async (req, res) => {
  try {
    const result = await db.query("SELECT id, name FROM users ORDER BY name ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
