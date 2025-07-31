import { Cart } from "../models/cart.model";
import { CartRepository } from "../repositories/cart.repository";

const cartRepo = new CartRepository();

export const cartService = {
    async getByUserId(id: number): Promise <Cart | null> {
        const cart = cartRepo.GetByUserId(id);
        return cart;
    },

    async create(cartData: any){
        const cart = await cartRepo.create(cartData);
        return cart;
    },

    async delete(id : number):Promise<void>{
        await cartRepo.delete(id);
    }
}