// server/src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { ResponseHandler } from '../utils/response'; // Import the response utility
import { CreateAdminDto,UpdateAdminDto } from '../models/admin.model';

interface AuthenticatedRequest extends Request {
  Admin?: any;
}

export const AdminController = {
  async getAllAdmins(req: Request, res: Response) {
    try {
      const Admins = await adminService.getAllAdmins();
      return ResponseHandler.success(res, 'Admins fetched successfully', Admins);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message);
    }
  },

  async getAdminById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const Admin = await adminService.getAdminById(id);
      if (!Admin) {
        return ResponseHandler.error(res, 'Admin not found', 404);
      }
      return ResponseHandler.success(res, 'Admin fetched successfully', Admin);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message, 401);
    }
  },

  async getAdminByEmail(req: Request, res: Response) {
    try {
      const email = String(req.params.email);
      const Admin = await adminService.getAdminByEmail(email);
      if (!Admin) {
        return ResponseHandler.error(res, 'Admin not found', 404);
      }
      return ResponseHandler.success(res, 'Admin fetched successfully', Admin);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message);
    }
  },

  async createAdmin(req: Request, res: Response) {
    try {
      const parsedData = CreateAdminDto.parse(req.body);
      const newAdmin = await adminService.createAdmin(parsedData);
      return ResponseHandler.success(res, 'Admin created successfully!', newAdmin);
    } catch (error:any) {
      console.log(error);
      return ResponseHandler.error(res, error.message);
    }
  },

  async updateAdmin(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parsedData = UpdateAdminDto.parse(req.body);
      const updatedAdmin = await adminService.updateAdmin(id, parsedData);
      if (!updatedAdmin) {
        return ResponseHandler.error(res, 'Admin not found', 404);
      }
      return ResponseHandler.success(res, 'Admin updated successfully!', updatedAdmin);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message);
    }
  },
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
  
    try {
      const result = await adminService.loginAdmin(email, password);
      res.status(200).json({
        message: 'Login successful',
        token: result.token,
        Admin: result.admin
        
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.Admin) {
        return res.status(401).json({ message: 'Unauthorized: No Admin found in token' });
      }

      const Admin = req.Admin; // from middleware
      res.status(200).json({ message: "Profile fetched successfully", Admin });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  async deleteAdmin(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await adminService.deleteAdmin(id);
      return ResponseHandler.success(res, 'Admin deleted successfully');
    } catch (error:any) {
      return ResponseHandler.error(res, error.message);
    }
  }
};
