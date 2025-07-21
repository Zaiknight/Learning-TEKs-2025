// server/src/repositories/admin.repository.ts
import { BaseRepository } from './base.repository';
import { Admin } from '../models/admin.model';
import { pool } from '../config/db';


export class AdminRepository extends BaseRepository<Admin> {
  constructor() {
    super('admins');
  }
  //READ
  async findByEmail(email: string) {
    return this.findByParameter('email', email);
  }  

  async createAdmin(adminData: any) {
    const { first_name,last_name, email, password, role } = adminData;

    const result = await pool.query(
      `INSERT INTO admins (first_name,last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [ first_name,last_name, email, password, role ]
    );
    const admin = result.rows[0];
    delete admin.password;
    return admin;
  }


};
