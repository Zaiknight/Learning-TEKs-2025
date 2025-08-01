import { OrderItems } from "../models/orderItems.model";
import { OrderItemsRepo } from "../repositories/orderItem.repository";

const orderItemRepo = new OrderItemsRepo();

export const orderItemsService = {
    
    async create(data : any) {
        const item = await orderItemRepo.create(data);
        return item;
    },

    async GetByorderId(id: number): Promise <OrderItems[] | null> {
        const orderitems = orderItemRepo.GetByorderId(id);
        return orderitems;
    },

    async delete(id : number):Promise<void>{
        await orderItemRepo.delete(id);
    },
}