import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { ResponseHandler } from "../utils/response";
import { ProductValidation } from "../validation/product.validation";

export const ProductController = {
    async getAll (req: Request, res: Response) {
        try {
            const products = await productService.getAll();
    
            // Attach full image URL
            const fullProducts = products.map((product: any) => ({
                ...product,
                img_path: `${req.protocol}://${req.get("host")}/uploads/${product.img_path}`
            }));
    
            return ResponseHandler.success(res, "Products Fetched", 200, fullProducts);
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

    async create(req: Request, res : Response){
        try {
            // Extract image path
            const imagePath = req.file ? `/productUploads/${req.file.filename}` : null;
            if (!imagePath) {
                return ResponseHandler.error(res, "Image file is required", 422);
            }
            // Inject image into body before validation
            const payload = { ...req.body, img_name: imagePath };
    
            await ProductValidation.add(payload, res);
        } catch (error : any) {
            return ResponseHandler.error(res, error.message, 500)
        }    
    },

    async update(req: Request, res : Response) {
      const id = Number(req.params.id);
      await ProductValidation.edit(id, req.body, res)
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