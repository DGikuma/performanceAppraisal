import { NextApiRequest, NextApiResponse } from 'next';
import { protect, DecodedToken } from './authMiddleware';

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: DecodedToken;
}

type NextHandler = (req: AuthenticatedNextApiRequest, res: NextApiResponse) => Promise<void> | void;

export const withProtect = (handler: NextHandler, allowedRoles?: string[]) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let responseSent = false;

    // Fake next() to simulate middleware behavior
    const fakeNext = () => {
      responseSent = true;
    };

    await new Promise<void>((resolve) => {
      protect(allowedRoles)(req as any, res as any, () => {
        fakeNext();
        resolve();
      });
    });

    // If protect didn't call next(), it already sent a response
    if (!responseSent) return;

    return handler(req as AuthenticatedNextApiRequest, res);
  };
};
