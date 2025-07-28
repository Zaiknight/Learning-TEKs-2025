import z from "zod";

export const productSchema = z.object({
    category_id : z.coerce.number().min(1, "Please Select a Product Category"),
    name: z.string().min(3, "Product name is too short"),
    description: z.string().min(20, "Description must be atleast 20 characters."),
    img_name: z.string(),
    price: z.coerce.number().min(1, "Please set a Price"),
    stock: z.coerce.number(),
})