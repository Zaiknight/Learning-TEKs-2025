import z from "zod";

export interface Order{
    id: number;
    user_id ?: number;
    user_email ?: string;
}

export const OrderDTO = z.object({
    user_id : z.number(),
    user_email: z.email("Invalid Email Format.")
})

export const CreateOrderDTO = OrderDTO.partial();