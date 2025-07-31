import { CartItems } from "../models/cartItems.model";
import { BaseRepository } from "./base.repository";


export class CartItemsRepo extends BaseRepository<CartItems>{
  constructor(){
    super('cart_items');
  }
};