import { NextApiResponse } from 'next';
import { withProtect, AuthenticatedNextApiRequest } from '../../middleware/withProtect';

const handler = async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
  const user = req.user; 
  res.status(200).json({ message: `Hello ${user?.role}` });
};

export default withProtect(handler, ['admin', 'supervisor']); // ✅ Use roles as needed
