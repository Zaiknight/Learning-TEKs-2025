import { BaseRepository } from './base.repository';
import { Category} from '../models/category.model';
import { pool } from '../config/db';


export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('categories');
  }
  //READ
  async findByName(name: string) {
    return this.findByParameter('name', name);
  }
};
