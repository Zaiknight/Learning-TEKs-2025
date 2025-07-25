import { Category } from "../models/category.model";
import { CategoryRepository } from "../repositories/category.repository";


const categoryRepo = new CategoryRepository();

export const categoryService ={
    async getAll(){
        return categoryRepo.findAll();
    },

    async getById(id:number): Promise <Category | null> {
        return categoryRepo.findById(id);
    },

    async getByName(name: string): Promise <Category | null> {
        return categoryRepo.findByName(name);
    },

    async create(categoryData : any) {
        const category = await categoryRepo.findByName(categoryData.name);

        if(category){
            throw new Error("Category Already Exists.")
        }

        return categoryRepo.create(categoryData);
    },

    async edit(id: number, updateData: any): Promise <Category | null> {
        return categoryRepo.update(id,updateData);
    },

    async delete(id: number): Promise<void>{
        await categoryRepo.delete(id);
    }
}