// server/src/repositories/user.repository.ts
import { BaseRepository } from './base.repository';
import { User } from '../models/user.model';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }
  //READ
  async findByEmail(email: string) {
    return this.findByParameter('email', email);
  }  
};
