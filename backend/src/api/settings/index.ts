import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../config/db';
import { verifyToken } from '../../middleware/authMiddleware'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // ✅ Secure this route for admins or supervisors
      const user = await verifyToken(req.headers, ['admin', 'supervisor']);

      const result = await db.query('SELECT * FROM settings LIMIT 1');
      const rows = result.rows || [];
      return res.status(200).json(rows[0] || {});
    } catch (error: any) {
      console.error(error);
      return res.status(
        error.message.includes('Forbidden') ? 403 : 401
      ).json({ message: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await verifyToken(req.headers, ['admin']);

      const { companyName, maintenanceMode, defaultLeaveDays } = req.body;

      const normalizedMaintenance = maintenanceMode === true || maintenanceMode === 'true';

      await db.query(
        `
        INSERT INTO settings (id, companyName, maintenanceMode, defaultLeaveDays)
        VALUES (1, $1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET
          companyName = EXCLUDED.companyName,
          maintenanceMode = EXCLUDED.maintenanceMode,
          defaultLeaveDays = EXCLUDED.defaultLeaveDays
        `,
        [companyName, normalizedMaintenance, defaultLeaveDays]
      );

      return res.status(200).json({ message: 'Settings updated' });
    } catch (error: any) {
      console.error(error);
      return res.status(
        error.message.includes('Forbidden') ? 403 : 401
      ).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
