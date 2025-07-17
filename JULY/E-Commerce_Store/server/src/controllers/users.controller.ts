
// server/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const UserController = {
  async getAllUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    res.json(users);
  },

  async getUserById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await UserService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  },

  async getUserByEmail(req: Request, res: Response){
    const email = String(req.params.email);
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  },

  async createUser(req: Request, res: Response) {
    const userData = req.body;
    const newUser = await UserService.createUser(userData);
    res.status(201).json(newUser);
  },

  async updateUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updatedUser = await UserService.updateUser(id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  },

  async deleteUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    await UserService.deleteUser(id);
    res.status(204).send(); // No Content
  }
};
