import { BaseRepository } from "./base.repository";
import { Cart } from "../models/cart.model";
import { pool } from "../config/db";


export class CartRepository extends BaseRepository<Cart> {
    constructor() {
        super("carts");
    }

    async GetByUserId(userid:number){
        const result = await pool.query(`
        SELECT * FROM carts
        WHERE user_id= $1`,[userid]);

      return result.rows[0] || null;    
    }
};