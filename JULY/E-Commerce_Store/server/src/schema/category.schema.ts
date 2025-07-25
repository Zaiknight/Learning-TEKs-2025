import z from "zod";

export const categorySchema = z.object({
    name: z.string().min(2, "Category name is too short."),
    description: z.string().min(20, "Description must be atleast 20 characters."),
    img_name: z.string(),
    active : z.boolean(),  
})