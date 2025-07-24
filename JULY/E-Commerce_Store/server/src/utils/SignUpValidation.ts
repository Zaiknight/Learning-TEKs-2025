import { z, ZodError } from "zod";
import { ResponseHandler } from "./response";
import { adminService } from "../services/admin.service";
import { Response } from "express";

const userSchema = z.object({
  first_name: z.string().min(3, "First name is required"),
  last_name: z.string().min(3, "Last name is required"),
  email: z.string().email("Email must contain @ and . symbols"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
      { message: "Password must contain uppercase, lowercase, and number" }
    ),
});

const adminSchema = userSchema.extend({
  role: z.string(),
});

function extractZodMessages(error: ZodError) {
  return error.issues.map(({ path, message }) => ({ path, message }));
}

export const UserValidation = {
  async validateAccountCreation(accountData: any, accountType: string, res: Response) {
    let accountSchema: z.ZodObject<any>;
    if (accountType.toLowerCase() === "admin") {
      accountSchema = adminSchema;
    } else if (accountType.toLowerCase() === "user") {
      accountSchema = userSchema;
    } else {
      return ResponseHandler.error(res, "Invalid account type", 400);
    }

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
     // return ResponseHandler.error(res, error.message, 422);
    }
  }
}