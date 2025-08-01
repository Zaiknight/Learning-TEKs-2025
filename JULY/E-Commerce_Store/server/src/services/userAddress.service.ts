import { UserAddressRepository } from "../repositories/userAddress.repository";

const userAddressRepo = new UserAddressRepository();

export const UserAddressService = {
  async create(userData : any){
    return await userAddressRepo.create(userData);
  }
}