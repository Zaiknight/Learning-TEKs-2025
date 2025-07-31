import { Request, Response } from "express";
import { cartItemsService } from "../services/cartItems.service";
import { ResponseHandler } from "../utils/response";

export const cartItemController = {             
    async create(req:Request, res: Response){
        try {
          const cart = await cartItemsService.create(req.body);
          return ResponseHandler.success(res, "Item Added", 200, cart);
        } catch (error : any) {
          return ResponseHandler.error(res,error.message, 403)
        }
      },
  
      async delete(req:Request, res: Response){
          try {
            const id = Number(req.params.id);
            await cartItemsService.delete(id);
            return ResponseHandler.success(res, 'Item deleted successfully',204);
          } catch (error:any) {
            return ResponseHandler.error(res, error.message, 500);
          }
      }
  
}