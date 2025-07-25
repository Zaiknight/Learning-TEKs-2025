import { BaseRepository } from "./base.repository";
import { Product } from "../models/product.model"; 

export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super('products');
    }

    async findByName(name: string){
        return this.findByParameter("name", name);
    }
};