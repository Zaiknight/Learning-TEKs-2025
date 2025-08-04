import { pool } from "../config/db";
import { CartItems } from "../models/cartItems.model";
import { BaseRepository } from "./base.repository";


export class CartItemsRepo extends BaseRepository<CartItems>{
  constructor(){
    super('cart_items');
  }

  async GetByCartId(userid:number){
    const result = await pool.query(`
    SELECT * FROM cart_items
    WHERE cart_id= $1`,[userid]);

  return result.rows|| null;    
  }

  async addQuantity(cartItemId:number){
    const updated = await pool.query(
      "UPDATE cart_items SET quantity = quantity + 1 WHERE id = $1 RETURNING *",
      [cartItemId]
    );

    

    return updated.rows[0];
  }

  async subQuantity(cartItemId:number){
    const updated = await pool.query(
      "UPDATE cart_items SET quantity = quantity -1 WHERE id = $1 RETURNING *",
      [cartItemId]
    );
    return updated.rows[0];
  }

  async EmptyCart(cart_id: number){
    await pool.query(`DELETE FROM ${this.table} WHERE cart_id = $1`,[cart_id]);
  }


};