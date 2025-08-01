import { OrderRepository } from "../repositories/orders.repository";

const OrderRepo = new OrderRepository();

export const OrderService = {
    async CreateGuestOrder(email: string){
        const order = await OrderRepo.createGuestOrder(email);
        return order;
    }
}