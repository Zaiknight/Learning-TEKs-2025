import { CartItems } from "../models/cartItems.model";
import { CartItemsRepo } from "../repositories/cartItems.repository";

const CartItemRepo = new CartItemsRepo();

export const cartItemsService = {
    
    async create(data : any) {
        const item = await CartItemRepo.create(data);
        return item;
    },

    async GetByCartId(id: number): Promise <CartItems[] | null> {
        const cartitems = CartItemRepo.GetByCartId(id);
        return cartitems;
    },

    async delete(id : number):Promise<void>{
        await CartItemRepo.delete(id);
    },

    async addQuantity(item_id: number):Promise <CartItems | null> {
      const updated = await CartItemRepo.addQuantity(item_id);
      return updated;
    },

    async subQuantity(item_id: number):Promise <CartItems | null> {
        const updated = await CartItemRepo.subQuantity(item_id);
        return updated;
      }

}