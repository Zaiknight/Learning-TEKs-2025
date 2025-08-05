import z from "zod";

export interface Order{
    id: number;
    user_id ?: number;
    user_email ?: string;
    status ?: string;
    payment_method ?: string;
    payment_status ?: string;
}

export const OrderDTO = z.object({
    user_id : z.number(),
    user_email: z.email("Invalid Email Format."),
    status: z.string().min(2),
})

const UpdateOrder = z.object({
    user_id : z.number(),
    user_email: z.email("Invalid Email Format."),
    status: z.string().min(2),
    payment_method : z.string(),
    payment_status : z.string()
})

export const CreateOrderDTO = OrderDTO.partial();
export const UpdateOrderDTO = UpdateOrder.partial();