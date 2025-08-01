import { UserAddress } from "../models/userAddress.model";
import { BaseRepository } from "./base.repository";


export class UserAddressRepository extends BaseRepository<UserAddress>{
  constructor() {
    super("user_addresses");
  }
}