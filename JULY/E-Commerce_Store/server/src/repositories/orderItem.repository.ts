import { pool } from "../config/db";
import { OrderItems } from "../models/orderItems.model";
import { BaseRepository } from "./base.repository";


export class OrderItemsRepo extends BaseRepository<OrderItems>{
  constructor(){
    super('order_items');
  }

  async GetByorderId(id:number){
    const result = await pool.query(`
    SELECT * FROM order_items
    WHERE order_id= $1`,[id]);

    return result.rows|| null;    
  }
};