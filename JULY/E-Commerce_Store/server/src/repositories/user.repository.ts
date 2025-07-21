// server/src/repositories/user.repository.ts
import { BaseRepository } from './base.repository';
import { User } from '../models/user.model';
import { pool } from '../config/db';


export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }
  //READ
  async findByEmail(email: string) {
    return this.findByParameter('email', email);
  }  

  async createUser(userData: any) {
    const { first_name,last_name, email, password } = userData;

    const result = await pool.query(
      `INSERT INTO users (first_name,last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [ first_name,last_name, email, password]
    );
    const user = result.rows[0];
    delete user.password;
    return user;
  }


};
