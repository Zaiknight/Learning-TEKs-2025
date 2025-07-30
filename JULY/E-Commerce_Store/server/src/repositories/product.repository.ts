import { BaseRepository } from "./base.repository";
import { Product } from "../models/product.model"; 
import { pool } from "../config/db";

export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super('products');
    }

    async findByName(name: string){
        return this.findByParameter("name", name);
    }

    async findByCategoryId(category_id : number) {
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE category_id = $1`, [category_id]);
        return result.rows || null;
    }  
};