// Base class implements DRY (DONT REPEAT YOURSELF) Principle

import { pool } from "../config/db";

export abstract class BaseModel<T> {
    protected table:string;
//we need to give give table names
    constructor (table:string){
        this.table = table;
    }


    //we make some default func to be used by all children

    //GET Methods
    async findAll(): Promise<T[]>{
        const result = await pool.query(`SELECT * FROM ${this.table}`);
        return result.rows;
    }

    async findById(id : number): Promise<T | null> {
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
        return result.rows[0] || null;
    }

    //DELETE Method
    async delete(id:number) : Promise<void> {
        await pool.query(`DELETE FROM ${this.table} WHERE id = $1`,[id]);
    }



}