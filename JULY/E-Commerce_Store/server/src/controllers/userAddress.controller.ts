import { Request, Response } from "express";
import { UserAddressDTO } from "../models/userAddress.model";
import { UserAddressService } from "../services/userAddress.service";
import { ResponseHandler } from "../utils/response";

export const UserAddressController = {
    async create(req: Request, res: Response) {
      try {
        const parsedData = UserAddressDTO.parse(req.body);
        const create = await UserAddressService.create(parsedData);
        return ResponseHandler.success(res, "Success", 200, create);
      } catch (error:any) {
        return ResponseHandler.error(res, error.message, 500);
      }
    }
}