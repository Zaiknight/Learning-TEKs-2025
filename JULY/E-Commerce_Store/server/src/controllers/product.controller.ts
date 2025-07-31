import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { ResponseHandler } from "../utils/response";
import { ProductValidation } from "../validation/product.validation";

export const ProductController = {
    async getAll (req: Request, res: Response) {
        try {
            const products = await productService.getAll();
    
            return ResponseHandler.success(res, "Products Fetched", 200, products);
        } catch (error: any) {
            return ResponseHandler.error(res, "Unable to Fetch", 500);
        }
    },
    async getById(req: Request, res : Response) {
        try {
            const id = Number(req.params.id);
            const product = await productService.getById(id);
            if(!product) {
                return ResponseHandler.error(res, "Product does not Exist", 404);
            }
            return ResponseHandler.success(res, "success", 200, product);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 401)
        }
    },

    async getByName( req: Request, res : Response) {
        try {
            const name = String(req.params.name);
            const product = await productService.getByName(name);
            if(!product) {
                return ResponseHandler.error(res, "Product does not Exist", 404);
            }
            return ResponseHandler.success(res, "success", 200, product);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 401)
        }
    },
     
    async getByCategoryID( req: Request, res: Response){
        try {
            const category_id = Number(req.params.category_id);
            const product = await productService.getByCategoryID(category_id);
            if(!product) {
                return ResponseHandler.error(res, "Product does not Exist", 404);
            }
            return ResponseHandler.success(res, "success", 200, product);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 401)
        }
    },

    async create(req: Request, res : Response){
        try {
            const imagePath = req.file ? `${req.file.filename}` : null;
            if (!imagePath) {
                return ResponseHandler.error(res, "Image file is required", 422);
            }
            const payload = { ...req.body, img_name: imagePath };
    
            await ProductValidation.add(payload, res);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 500)
        }    
    },

    async update(req: Request, res : Response) {
      const id = Number(req.params.id);
      try {
        const img_path = req.file ? `${req.file.filename}` : null;
        if(!img_path) {
            return ResponseHandler.error(res, "Image file is required", 422);
        }
        const payload = { ...req.body, img_name: img_path };

        await ProductValidation.edit(id, payload, res)

      } catch (error:any) {
        return ResponseHandler.error(res, error.message, 500)
      }
    },

    async delete(req:Request, res: Response){
        try {
          const id = Number(req.params.id);
          await productService.delete(id);
          return ResponseHandler.success(res, "Product Deleted Successfully", 204);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 500);
        }
    }
}