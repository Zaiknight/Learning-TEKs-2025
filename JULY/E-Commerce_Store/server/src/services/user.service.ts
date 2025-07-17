// server/src/services/user.service.ts
import { CreateUserDTO, UpdateUserDTO, User} from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export const UserService = {
  
  async getAllUsers(): Promise<User[]> {
    return userRepository.findAll();
  },

  async getUserById(id: number): Promise<User | null> {
    const user = userRepository.findById(id);
    return user;
  },

  async getUserByEmail(email:string): Promise<User | null>{
    const user = userRepository.findByEmail(email);
    return user;
  },

  async createUser(userData: CreateUserDTO): Promise<User> {
    //email format check (if needed), todo:hash password (later), need to RND encryption libraries
    return userRepository.create(userData);
  },

  async updateUser(id: number, updates: Partial<UpdateUserDTO>): Promise<User | null> {
    return userRepository.update(id, updates);
  },

  async deleteUser(id: number): Promise<void> {
    await userRepository.delete(id);
  }
};
