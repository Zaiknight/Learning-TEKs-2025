import { CartItemsRepo } from "../repositories/cartItems.repository";

const CartItemRepo = new CartItemsRepo();

export const cartItemsService = {
    
    async create(data : any) {
        const item = await CartItemRepo.create(data);
        return item;
    },
    async delete(id : number):Promise<void>{
        await CartItemRepo.delete(id);
    }

}