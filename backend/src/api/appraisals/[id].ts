import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === "PUT") {
      const { rating, comments } = req.body;
      const result = await db.query(
        "UPDATE appraisals SET rating = $1, comments = $2 WHERE id = $3 RETURNING *",
        [rating, comments, id]
      );
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === "DELETE") {
      await db.query("DELETE FROM appraisals WHERE id = $1", [id]);
      return res.status(204).end();
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Appraisal ID API error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
