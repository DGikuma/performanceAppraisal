import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../config/db'; // your existing db.ts connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await db.query(`
      SELECT 
        a.id,
        u1.fullname AS employee_name,
        u2.fullname AS reviewer_name,
        ap.name AS period_name,
        a.status,
        a.overall_rating,
        a.created_at
      FROM appraisals a
      JOIN users u1 ON a.employee_id = u1.id
      LEFT JOIN users u2 ON a.supervisor_id = u2.id
      JOIN appraisal_periods ap ON a.period_id = ap.id
      ORDER BY a.created_at DESC;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ error: 'Failed to load appraisals' });
  }
}
