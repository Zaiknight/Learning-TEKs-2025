// server/src/repositories/user.repository.ts
import { BaseRepository } from './base.repository';
import { User } from '../models/user.model';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';


export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }
  //READ
  async findByEmail(email: string) {
    return this.findByParameter('email', email);
  }  

  async createUser(userData: any) {
    const { name, email, password } = userData;

    // Step 1: Hash the password before inserting
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const result = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, hashedPassword]
    );

    

    const existing:any = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existing.rowCount > 0){
      throw new Error('Email already exists');
    } else{
      return result.rows[0];
  }
  }


};
