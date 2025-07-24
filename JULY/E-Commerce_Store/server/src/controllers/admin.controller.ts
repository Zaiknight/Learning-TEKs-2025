// server/src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { ResponseHandler } from '../utils/response'; // Import the response utility
import { UpdateAdminDto } from '../models/admin.model';
import { UserValidation } from '../utils/SignUpValidation';

interface AuthenticatedRequest extends Request {
  Admin?: any;
}

export const AdminController = {
  async getAllAdmins(req: Request, res: Response) {
    try {
      const Admins = await adminService.getAllAdmins();
      return ResponseHandler.success(res, 'Admins fetched successfully',200, Admins);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  },

  async getAdminById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const Admin = await adminService.getAdminById(id);
      if (!Admin) {
        return ResponseHandler.error(res, 'Admin not found', 404);
      }
      return ResponseHandler.success(res, 'Admin fetched successfully',200, Admin);
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
      return ResponseHandler.success(res, 'Admin fetched successfully',200, Admin);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  },

  async createAdmin(req: Request, res: Response) {
      await UserValidation.validateAccountCreation(req.body, "admin", res);
  },


  async updateAdmin(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parsedData = UpdateAdminDto.parse(req.body); 
      const updatedAdmin = await adminService.updateAdmin(id, parsedData);
      if (!updatedAdmin) {
        return ResponseHandler.error(res, 'Admin not found', 404);
      }
      return ResponseHandler.success(res, 'Admin updated successfully!',202, updatedAdmin.id);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  },
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
  
    try {
      await adminService.loginAdmin(email, password, res);
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
      return ResponseHandler.success(res, 'Admin deleted successfully',204);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message, 500);
    }
  }
};
