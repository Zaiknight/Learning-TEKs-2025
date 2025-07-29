import { z, ZodError } from "zod";
import { ResponseHandler } from "../utils/response";
import { adminService } from "../services/admin.service";
import { Response } from "express";
import { adminSchema } from "../schema/admin.schema";
import { userSchema } from "../schema/user.schema";
import { UserService } from "../services/user.service";


export const UserValidation = {


  async validateAccountCreation(accountData: any, accountType: string, res: Response) {
    let accountSchema: z.ZodObject<any>;


    if (accountType.toLowerCase() === "admin") {

      accountSchema = adminSchema;

      try {
        const validatedData = accountSchema.parse(accountData);
        console.log("Validation Successful: ", validatedData);   
        const newAdmin = await adminService.createAdmin(validatedData);
        return ResponseHandler.success(res, 'Admin created successfully!', 201, newAdmin.id);
      } catch (error: any) {
        if (error instanceof ZodError) {
          const messages = error.issues.map(issue => ({
            path: issue.path,      // ["email"], ["password"], etc.
            message: issue.message // "Email must contain @ and . symbols"
          }));
          console.log("Validation Errors: ",  messages);
          return ResponseHandler.validationError(res, messages);
        }
       return ResponseHandler.error(res, error.message, 422);
      }



    } else if (accountType.toLowerCase() === "user") {

      accountSchema = userSchema;

      try {
        const validatedData = accountSchema.parse(accountData);
        console.log("Validation Successful: ", validatedData);   
        const newUser = await UserService.createUser(validatedData);
        return ResponseHandler.success(res, 'User created successfully!', 201, newUser.id);
      } catch (error: any) {
        if (error instanceof ZodError) {
          const messages = error.issues.map(issue => ({
            path: issue.path,      // ["email"], ["password"], etc.
            message: issue.message // "Email must contain @ and . symbols"
          }));
          console.log("Validation Errors: ",  messages);
          return ResponseHandler.validationError(res, messages);
        }
       return ResponseHandler.error(res, error.message, 422);
      }


    } else {
      return ResponseHandler.error(res, "Invalid account type", 400);
    }

  }
}