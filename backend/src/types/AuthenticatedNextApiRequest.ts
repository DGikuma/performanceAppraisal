import { NextApiRequest } from 'next';

export interface DecodedToken {
  id: number;
  role: string;
  department?: string;
}

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: DecodedToken;
}
