import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../config/db"; // adjust path based on your setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { score } = req.body;
    if (typeof score === "undefined") {
      return res.status(400).json({ message: "Score is required." });
    }

    try {
      await db.query(`UPDATE appraisals SET score = ? WHERE id = ?`, [score, id]);
      res.status(200).json({ message: "Score updated successfully." });
    } catch (error) {
      console.error("Error updating appraisal:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
