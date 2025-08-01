import { pool } from "../config/db";
import { Order } from "../models/orders.model";
import { BaseRepository } from "./base.repository";

export class OrderRepository extends BaseRepository<Order> {
    constructor(){
        super("orders");
    }

    async createGuestOrder(user_email: string){
        const result = await pool.query(
          `INSERT INTO orders (user_email) VALUES ($1) RETURNING *`,
          [ user_email ]
        );
        const guest = result.rows[0];
        return guest;
    }

    async getByEmail(user_email:string){
        return this.findByParameter('user_email',user_email);
    }
}