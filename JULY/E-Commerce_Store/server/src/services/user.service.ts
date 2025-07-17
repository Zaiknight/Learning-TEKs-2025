// server/src/services/user.service.ts
import { CreateUserDTO, User, UserModel } from '../models/user.model';

const userModel = new UserModel();

export const UserService = {
  
  async getAllUsers(): Promise<User[]> {
    return userModel.findAll();
  },

  async getUserById(id: number): Promise<User | null> {
    const user = userModel.findById(id);
    return user;
  },

  async getUserByEmail(email:string): Promise<User | null>{
    const user = userModel.findByEmail(email);
    return user;
  },

  async createUser(userData: CreateUserDTO): Promise<User> {
    //email format check (if needed), todo:hash password (later), need to RND encryption libraries
    return userModel.create(userData);
  },

  async updateUser(id: number, updates: Partial<CreateUserDTO>): Promise<User | null> {
    return userModel.update(id, updates);
  },

  async deleteUser(id: number): Promise<void> {
    await userModel.delete(id);
  }
};
