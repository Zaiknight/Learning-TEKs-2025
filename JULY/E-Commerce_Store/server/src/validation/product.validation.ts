import { Response } from "express";
import { productSchema } from "../schema/product.schema";
import { productService } from "../services/product.service";
import { ResponseHandler } from "../utils/response";
import { ZodError } from "zod";

export const ProductValidation = {
    async add(product: any, res: Response) {
        try {
            const validatedProduct = productSchema.parse(product);
            console.log("Validation Successful: ", validatedProduct);
            const newProduct = await productService.create(validatedProduct);
            return ResponseHandler.success(res, "Product Added!", 200, newProduct);
        } catch (error : any) {
            if (error instanceof ZodError) {
                const messages = error.issues.map(issue => ({
                  path: issue.path,      
                  message: issue.message
                }));
                console.log("Validation Errors: ",  messages);
                return ResponseHandler.validationError(res, messages);
              }
             return ResponseHandler.error(res, error.message, 422);
        }
    },
    async edit(id : number,update : any, res : Response) {
        try {
            const updatedData = productSchema.partial().parse(update);
            console.log("Validation Successful: ", updatedData);   
            const updatedProduct = await productService.edit(id, updatedData);
            return ResponseHandler.success(res, "Updated Category!", 200, updatedProduct);
        } catch (error:any) {
            if (error instanceof ZodError) {
                const messages = error.issues.map(issue => ({
                  path: issue.path,      
                  message: issue.message
                }));
                console.log("Validation Errors: ",  messages);
                return ResponseHandler.validationError(res, messages);
              }
             return ResponseHandler.error(res, error.message, 422);
        }
    }
}