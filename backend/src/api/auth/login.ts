
import type { NextApiRequest, NextApiResponse } from 'next';

import { login as loginLogic } from '../../controllers/authController';

async function nextToExpress(req: NextApiRequest, res: NextApiResponse) {
  (req as any).query = req.query;
  (req as any).params = {};
  (res as any).status = (code: number) => {
    res.status(code);
    return res;
  };
  (res as any).json = (data: any) => res.json(data);
  return { req: req as any, res: res as any };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const { req: expressReq, res: expressRes } = await nextToExpress(req, res);

    const result = await loginLogic(expressReq, expressRes);

  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
