// server/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ResponseHandler } from '../utils/response'; // Import the response utility
import { CreateUserDto,UpdateUserDto } from '../models/user.model';
import { ZodError } from "zod";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const UserController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      return ResponseHandler.success(res, 'Users fetched successfully',200,users);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message, 401);
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await UserService.getUserById(id);
      if (!user) {
        return ResponseHandler.error(res, 'User not found', 404);
      }
      return ResponseHandler.success(res, 'User fetched successfully',200, user.id);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message, 401);
    }
  },

  async getUserByEmail(req: Request, res: Response) {
    try {
      const email = String(req.params.email);
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return ResponseHandler.error(res, 'User not found', 404);
      }
      return ResponseHandler.success(res, 'User fetched successfully',200, user);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDto.parse(req.body);
      const newUser = await UserService.createUser(parsedData);
      return ResponseHandler.success(res, 'User created successfully!',201, newUser);
    } catch (error:any) {
      console.log(error);
      return ResponseHandler.error(res, error.message,500);
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parsedData = UpdateUserDto.parse(req.body);
      const updatedUser = await UserService.updateUser(id, parsedData);
      if (!updatedUser) {
        return ResponseHandler.error(res, 'User not found', 404);
      }
      return ResponseHandler.success(res, 'User updated successfully!',201, updatedUser);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  },
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
  
    try {
      const result = await UserService.loginUser(email, password);
      res.status(200).json({
        message: 'Login successful',
        token: result.token,
        user: result.user
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user found in token' });
      }

      const user = req.user; // from middleware
      res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await UserService.deleteUser(id);
      return ResponseHandler.success(res, 'User deleted successfully',202);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  }
};
