import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { ResponseHandler } from '../utils/response';
import { CategoryValidation } from '../validation/category.validation';


export const CategoryController = {
    async getAll( req: Request, res: Response) {
        try {
            const categories = await categoryService.getAll();
            return ResponseHandler.success(res, "Categories Fetched Successfully", 200, categories);
        } catch (error) {
            return ResponseHandler.error(res, "Unable to fetch categories", 422);
        }
    },

    async getById(req: Request, res : Response) {
        try {
            const id = Number(req.params.id);
            const category = await categoryService.getById(id);
            if(!category) {
                return ResponseHandler.error(res, "Category does not Exist", 404);
            }
            return ResponseHandler.success(res, "success", 200, category);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 401)
        }
    },

    async getByName( req: Request, res : Response) {
        try {
            const name = String(req.params.name);
            const category = await categoryService.getByName(name);
            if(!category) {
                return ResponseHandler.error(res, "Category does not Exist", 404);
            }
            return ResponseHandler.success(res, "success", 200, category);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 401)
        }
    },

    async create(req: Request, res : Response){
        try {
            const imagePath = req.file ? `${req.file.filename}` : null;
            if(!imagePath){
                return ResponseHandler.error(res, "Image file is required",422);
            }
            const payload = {...req.body, img_name: imagePath};
            await CategoryValidation.create(payload,res);
        } catch (error :any) {
            return ResponseHandler.error(res, error.message, 500)
        }

    },

    async update(req: Request, res : Response) {
      const id = Number(req.params.id);
      await CategoryValidation.validateEdit(id, req.body, res)
    },

    async delete(req:Request, res: Response){
        try {
          const id = Number(req.params.id);
          await categoryService.delete(id);
          return ResponseHandler.success(res, "Category Deleted Successfully", 204);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 500);
        }
    }
};