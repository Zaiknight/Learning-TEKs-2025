// server/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ResponseHandler } from '../utils/response'; // Import the response utility
import { CreateUserDto,UpdateUserDto } from '../models/user.model';
import { ZodError } from "zod";


export const UserController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      return ResponseHandler.success(res, 'Users fetched successfully', users);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message);
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await UserService.getUserById(id);
      if (!user) {
        return ResponseHandler.error(res, 'User not found', 404);
      }
      return ResponseHandler.success(res, 'User fetched successfully', user);
    } catch (error:any) {
      return ResponseHandler.BadRequestError(res);
    }
  },

  async getUserByEmail(req: Request, res: Response) {
    try {
      const email = String(req.params.email);
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return ResponseHandler.error(res, 'User not found', 404);
      }
      return ResponseHandler.success(res, 'User fetched successfully', user);
    } catch (error:any) {
      return ResponseHandler.BadRequestError(res, error.message);
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDto.parse(req.body);
      const newUser = await UserService.createUser(parsedData);
      return ResponseHandler.success(res, 'User created successfully!', newUser);
    } catch (error:any) {
      if (error instanceof ZodError) {
        return ResponseHandler.validationError(res, error.flatten().fieldErrors);
      }
      return ResponseHandler.error(res, error.message);
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
      return ResponseHandler.success(res, 'User updated successfully!', updatedUser);
    } catch (error:any) {
      if (error instanceof ZodError) {
        return ResponseHandler.validationError(res, error.flatten().fieldErrors);
      }
      return ResponseHandler.error(res, error.message);
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await UserService.deleteUser(id);
      return ResponseHandler.success(res, 'User deleted successfully');
    } catch (error:any) {
      return ResponseHandler.error(res, error.message);
    }
  }
};
