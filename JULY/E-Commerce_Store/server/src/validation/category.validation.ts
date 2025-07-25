import { ZodError } from "zod";
import { categorySchema } from "../schema/category.schema"
import { categoryService } from "../services/category.service";
import { ResponseHandler } from "../utils/response";
import { Response } from "express";



export const CategoryValidation = {
    async validateCreate(category : any, res : Response) {
        try {
            const validatedData = categorySchema.parse(category);
            console.log("Validation Successful: ", validatedData);   
            const newCategory = await categoryService.create(validatedData);
            return ResponseHandler.success(res, "Category Created!", 200, newCategory);         
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
    },

    async validateEdit(id : number,update : any, res : Response) {
        try {
            const updatedData = categorySchema.partial().parse(update);
            console.log("Validation Successful: ", updatedData);   
            const updatedCategory = await categoryService.edit(id, updatedData);
            return ResponseHandler.success(res, "Updated Category!", 200, updatedCategory);
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