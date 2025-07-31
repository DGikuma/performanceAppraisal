import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const result = await db.query("SELECT * FROM departments ORDER BY name ASC");
      return res.status(200).json(result.rows);
    }

    if (req.method === "POST") {
      const { name, head } = req.body;
      const result = await db.query(
        "INSERT INTO departments (name, head) VALUES ($1, $2) RETURNING *",
        [name, head]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Departments API error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}