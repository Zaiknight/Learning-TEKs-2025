// server/src/services/user.service.ts
import {User} from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { AuthUtil } from '../utils/auth.util';
import bcrypt from 'bcrypt';


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

  async createUser(userData: any) {
    userData.password = await AuthUtil.hashPassword(userData.password);
    const createdUser = await userRepository.createUser(userData);
    delete createdUser.password;
    return createdUser;
  },

  async loginUser(email: string, password: string) {
    const user = await userRepository.findByEmail(email); // now returns a single user
  
    if (!user) {
      throw new Error('User Does not exist');
    }
  
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Entered Password: ",password);
    console.log("Stored Password: ",user.password);
    if (!isValid) {
      throw new Error('Invalid credential');
    }
  
    const token = AuthUtil.generateToken({ id: user.id, email: user.email });
    
    return { user, token };
  },

  async updateUser(id: number, updates:any): Promise<User | null> {
    return userRepository.update(id, updates);
  },

  async deleteUser(id: number): Promise<void> {
    await userRepository.delete(id);
  }
};
