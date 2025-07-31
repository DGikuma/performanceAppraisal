import express from "express";
import { db } from "../config/db";
import { protect } from "../middleware/authMiddleware"; 

const router = express.Router();

// ✅ Only admin can GET settings
router.get("/", protect(["admin"]), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM settings LIMIT 1");
    const rows = result.rows || [];
    return res.status(200).json(rows[0] || {});
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// ✅ Only admin can POST settings
router.post("/", protect(["admin"]), async (req, res) => {
  try {
    const { companyName, maintenanceMode, defaultLeaveDays } = req.body;

    await db.query(
      `
      INSERT INTO settings (id, companyName, maintenanceMode, defaultLeaveDays)
      VALUES (1, $1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET
        companyName = EXCLUDED.companyName,
        maintenanceMode = EXCLUDED.maintenanceMode,
        defaultLeaveDays = EXCLUDED.defaultLeaveDays
      `,
      [companyName, maintenanceMode ? true : false, defaultLeaveDays]
    );

    res.status(200).json({ message: "Settings updated" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

export default router;
