import { NextApiRequest } from 'next';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  id: number;
  role: string;
  department?: string;
}

// Extend Express Request to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedToken;
  }
}

// Extend NextApiRequest for Next.js usage
export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: DecodedToken;
}

// ✅ Express Middleware
export const protect = (allowedRoles?: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      req.user = decoded;

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Forbidden: Access denied' });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }
  };
};

// ✅ Reusable for Next.js API handlers
export const verifyToken = async (
  headers: NextApiRequest['headers'],
  allowedRoles?: string[]
): Promise<DecodedToken> => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("🚫 No token provided or malformed Authorization header");
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded: DecodedToken;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (err) {
    console.log("❌ Token verification failed:", err);
    throw new Error('Unauthorized: Invalid token');
  }

  console.log("🔐 Decoded token:", decoded);
  console.log("📜 allowedRoles:", allowedRoles);

  const decodedRole = decoded.role?.toLowerCase().trim();
  const roles = allowedRoles?.map(r => r.toLowerCase().trim()) || [];

  console.log("🧪 Role match?", roles.includes(decodedRole));
  console.log("🧾 Role being checked:", decodedRole);

  if (allowedRoles && !roles.includes(decodedRole)) {
    throw new Error('Forbidden: Access denied');
  }

  return decoded;
};



