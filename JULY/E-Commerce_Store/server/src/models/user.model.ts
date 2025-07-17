/*  server/src/models/user.model.ts   */

import { BaseModel } from "./base.model";
import { pool } from "../config/db";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}


export class UserModel extends BaseModel<User> {
  constructor() {
    super('users');
  }

  //class specific methods
  async create(user: CreateUserDTO): Promise<User> {
    const { first_name, last_name, email, password } = user;
    const res = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [first_name, last_name, email, password]
    );
    return res.rows[0];
  }

  async update(id: number, updates: Partial<CreateUserDTO>): Promise<User | null> {
    const { first_name, last_name, email, password } = updates;
    const res = await pool.query(
      `UPDATE users SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        password = COALESCE($4, password),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [first_name, last_name, email, password, id]
    );
    return res.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null>{
    const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return res.rows[0] || null;
  }
}