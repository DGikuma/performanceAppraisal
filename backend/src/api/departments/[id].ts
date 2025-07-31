import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const idParam = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const id = parseInt(idParam, 10);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid department ID" });
  }

  try {
    if (req.method === "GET") {
      const result = await db.query("SELECT * FROM departments WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Department not found" });
      }
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === "PUT") {
      const { name, head } = req.body;
      const result = await db.query(
        "UPDATE departments SET name = $1, head = $2 WHERE id = $3 RETURNING *",
        [name, head, id]
      );
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === "DELETE") {
      await db.query("DELETE FROM departments WHERE id = $1", [id]);
      return res.status(204).end();
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Department ID API error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
