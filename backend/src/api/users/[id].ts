import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../config/db';
import { verifyToken } from '../../middleware/authMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    headers,
  } = req;

  // Protect route manually (for Next.js API)
  try {
    await verifyToken(headers); // your middleware should verify and throw if unauthorized
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (method === 'GET') {
    try {
      const result = await db.query(
        "SELECT id, name, email, department, role FROM users WHERE id = $1",
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
