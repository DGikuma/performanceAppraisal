import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const result = await db.query(
        `SELECT id, name, email, department, role, created_at FROM users ORDER BY created_at DESC`
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
