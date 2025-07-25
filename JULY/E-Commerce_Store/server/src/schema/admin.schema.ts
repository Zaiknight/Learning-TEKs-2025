import z from "zod";
import { userSchema } from "./user.schema";

export const adminSchema = userSchema.extend({
    role: z.string(),
  });