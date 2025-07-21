/*  server/src/models/admin.model.ts   */
import { z } from "zod";

export interface Admin {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}


export const CreateAdminDto = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const UpdateAdminDto = CreateAdminDto.partial(); // all fields optional

