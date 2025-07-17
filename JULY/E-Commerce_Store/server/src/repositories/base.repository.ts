import {pool} from '../config/db';

// DRY (DONT REPEAT YOURSELF) Principle

export abstract class BaseRepository<Base>{
    protected table:string;
//we need to give give table names
    constructor (table:string){
        this.table = table;
    }
        //we make some default func to be used by all children
    //CREATE Method
    async create<D extends Record<string, any>>(data: D): Promise<Base> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
        const query = `
          INSERT INTO ${this.table} (${keys.join(', ')})
          VALUES (${placeholders})
          RETURNING *
        `;
      
        const res = await pool.query(query, values);
        return res.rows[0];
      }
      
    //READ Methods
    async findAll(): Promise<Base[]>{
        const result = await pool.query(`SELECT * FROM ${this.table}`);
        return result.rows;
    }

    async findById(id : number): Promise<Base | null> {
        const result = await pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
        return result.rows[0] || null;
    }     
           
    async findByParameter<K extends string, V = any>(key: K, value: V): Promise<Base | null> {
        const query = `SELECT * FROM ${this.table} WHERE ${key} = $1`;
        const result = await pool.query(query, [value]);
        return result.rows[0] || null;
      }
      

    //UPDATE Method
    async update<D extends Record<string, any>>(id: number, data: D): Promise<Base> {
        const keys = Object.keys(data);
        const values = Object.values(data);
      
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const query = `
          UPDATE ${this.table}
          SET ${setClause},updated_at = CURRENT_TIMESTAMP
          WHERE id = $${keys.length + 1}
          RETURNING *
        `;
      
        const res = await pool.query(query, [...values, id]);
        return res.rows[0];
      }

    //DELETE Method
    async delete(id:number) : Promise<void> {
        await pool.query(`DELETE FROM ${this.table} WHERE id = $1`,[id]);
    }
}