// server/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

// Not Found Middleware
export function NotFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ message: 'Route not found' });
}

// General Error Handler
export function ErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err); // log the error for dev

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ error: message });
}
