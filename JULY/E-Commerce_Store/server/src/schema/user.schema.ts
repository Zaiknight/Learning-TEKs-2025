import { z,  } from "zod";


export const userSchema = z.object({
    first_name: z.string().min(3, "First name is required"),
    last_name: z.string().min(3, "Last name is required"),
    email: z.email("Email must contain @ and . symbols"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (password) => /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
        { message: "Password must contain uppercase, lowercase, and number" }
      ),
  });