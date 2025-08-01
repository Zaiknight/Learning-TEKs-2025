import { Order } from "../models/orders.model";
import { OrderRepository } from "../repositories/orders.repository";

const OrderRepo = new OrderRepository();

export const OrderService = {
    async CreateGuestOrder(email: string){
        const order = await OrderRepo.createGuestOrder(email);
        return order;
    },

    async GetByEmail(email:string):Promise<Order | null>{
        const orders = await OrderRepo.getByEmail(email);
        return orders;
    },

    async createOrder(orderData : any){
        const order = await OrderRepo.create(orderData);
        return order;
    }
}