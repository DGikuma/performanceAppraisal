import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db";
import { Parser } from "json2csv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const result = await db.query(
        `SELECT name, email, department, role, created_at FROM users ORDER BY created_at DESC`
      );

      const parser = new Parser({ fields: ["name", "email", "department", "role", "created_at"] });
      const csv = parser.parse(result.rows);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=employees.csv");
      res.status(200).send(csv);
    } catch (err) {
      console.error("CSV Export Error:", err);
      res.status(500).json({ message: "Failed to export CSV" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
