import { ProductRepository } from "../repositories/product.repository";


const productRepo = new ProductRepository();

export const productService = {
      async getAll(){
        return productRepo.findAll();
      },

      async getById(id : number) {
        return productRepo.findById(id);
      },

      async getByName(name: string){
        return productRepo.findByName(name);
      },

      async getByCategoryID(id : number){
        return productRepo.findByCategoryId(id);
      },

      async create(productData : any) {
        return productRepo.create(productData);
      },

      async edit(id: number, updateData: any){
        return productRepo.update(id,updateData);
      },

      async delete(id: number){
        await productRepo.delete(id);
      }
}