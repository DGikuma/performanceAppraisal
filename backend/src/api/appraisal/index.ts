import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db"; // adjust path based on your db setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const result = await db.query(`
        SELECT 
          a.id,
          a.employee_name,
          a.reviewer_name,
          a.status,
          a.score,
          a.date
        FROM appraisals a
        ORDER BY a.date DESC
      `);
      res.status(200).json(result.rows || result);
    } catch (error) {
      console.error("Error fetching appraisals:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
