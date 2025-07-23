// server/src/services/admin.service.ts
import {Admin} from '../models/admin.model';
import { AdminRepository } from '../repositories/admin.repository';
import { AuthUtil } from '../utils/auth.util';


const adminRepository = new AdminRepository();

export const adminService = {
  
  async getAllAdmins(): Promise<Admin[]> {
    return adminRepository.findAll();
  },

  async getAdminById(id: number): Promise<Admin | null> {
    const admin = adminRepository.findById(id);
    return admin;
  },

  async getAdminByEmail(email:string): Promise<Admin | null>{
    const admin = adminRepository.findByEmail(email);
    return admin;
  },

  async createAdmin(adminData: any) {
    const admin = await adminRepository.findByEmail(adminData.email); 
  
    if (admin) {
      throw new Error('Email already exists in directory,go to: Login');
    }
  
    adminData.password = await AuthUtil.hashPassword(adminData.password);
    const createdadmin = await adminRepository.createAdmin(adminData);
    delete createdadmin.password;
    return createdadmin;
  },

  async loginAdmin(email: string, password: string) {

    const admin = await adminRepository.findByEmail(email); 
  
    if (!admin) {
      throw new Error('Admin does not exist');
    }
  
    const isValid = await AuthUtil.comparePasswords(password, admin.password);
    if (!isValid) {
      throw new Error('Invalid Password');
    }else{
      console.log("Logged In");
    }
  
    const token = AuthUtil.generateToken({ id: admin.id, email: admin.email });
    
    return { admin,token };
  },

  async updateAdmin(id: number, updates:any): Promise<Admin | null> {
    updates.password = await AuthUtil.hashPassword(updates.password);
    return adminRepository.update(id, updates);
  },

  async deleteAdmin(id: number): Promise<void> {
    await adminRepository.delete(id);
  }
};

