import { Request, Response, NextFunction } from 'express';
import { AuthUtil } from '../utils/auth.util';

// Extend Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = AuthUtil.verifyToken(token); // Decoded payload (e.g., { id, email })
    req.user = payload; // Attach to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
