import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const result = await db.query(
        `SELECT id, name, email, department, role, supervisor_id FROM users WHERE id = $1`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.status(200).json(result.rows[0]); // <== return single employee object
    } catch (err) {
      console.error("Failed to fetch employee:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "PUT") {
    const { name, email, department, role, supervisor_id } = req.body;

    try {
      const result = await db.query(
        `UPDATE users 
         SET name = $1, email = $2, department = $3, role = $4, supervisor_id = $5 
         WHERE id = $6 
         RETURNING *`,
        [name, email, department, role, supervisor_id || null, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.status(200).json({ message: "Employee updated", user: result.rows[0] });
    } catch (err) {
      console.error("Failed to update employee:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await db.query(`DELETE FROM users WHERE id = $1`, [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "Employee deleted" });
    } catch (err) {
      console.error("Failed to delete employee:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
