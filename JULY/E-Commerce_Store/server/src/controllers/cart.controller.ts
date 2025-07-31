import { Request, Response } from "express";
import { cartService } from "../services/cart.service";
import { ResponseHandler } from "../utils/response";

export const CartController = {
    async getByUserId(req: Request, res: Response){
        try {
          const user_id = Number(req.params.user_id);
          const cart = await cartService.getByUserId(user_id);

          if(!cart){
            return ResponseHandler.error(res, 'Error: Cart Not Found', 404);
          }

          return ResponseHandler.success(res, "Successfully Retreived Cart", 200, cart);
        
        } catch (error:any) {
          return ResponseHandler.error(res, "error.message", 404);
        }
    },

    async create(req:Request, res: Response){
      try {
        const cart = await cartService.create(req.body);
        return ResponseHandler.success(res, "Cart Created", 200, cart);
      } catch (error : any) {
        return ResponseHandler.error(res,error.message, 403)
      }
    },

    async delete(req:Request, res: Response){
        try {
          const id = Number(req.params.id);
          await cartService.delete(id);
          return ResponseHandler.success(res, 'Cart deleted successfully',204);
        } catch (error:any) {
          return ResponseHandler.error(res, error.message, 500);
        }
    }

}