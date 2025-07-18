// server/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);

      res.json({
        code: 200,
        status: 'success',
        message: 'Login successful',
        data: { token, user },
      });
    } catch (error:any) {
      res.status(401).json({
        code: 401,
        status: 'error',
        message: error.message || 'Unauthorized',
      });
    }
  },
};
