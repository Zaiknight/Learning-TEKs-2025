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

    async getByCartId(req: Request, res: Response){
      try {
        const cart_id = Number(req.params.cart_id);
        const cartitems = await cartItemsService.GetByCartId(cart_id)

        if(!cartitems){
          return ResponseHandler.error(res, 'Error: Cart Items Not Found', 404);
        }

        return ResponseHandler.success(res, "Success", 200, cartitems )
      } catch (error:any) {
        return ResponseHandler.error(res, error.message, 404);
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
      },

      async addQuantity(req: Request, res: Response){
        try {
          const id = Number(req.params.id);

          if(!id){
            return ResponseHandler.error(res, 'Id not found', 404);

          }
          const updatedItem = await cartItemsService.addQuantity(id);

        if (!updatedItem) {
        return ResponseHandler.error(res, 'Item not found', 404);
      }
      return ResponseHandler.success(res, 'Item updated successfully!',201, updatedItem);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,400);
    }
  },
  
    async subQuantity(req: Request, res: Response){
      try {
        const id = Number(req.params.id);

        if(!id){
          return ResponseHandler.error(res, 'Id not found', 404);

        }
        const updatedItem = await cartItemsService.subQuantity(id);

      if (!updatedItem) {
      return ResponseHandler.error(res, 'Item not found', 404);
    }
    return ResponseHandler.success(res, 'Item updated successfully!',201, updatedItem);
  } catch (error:any) {
    return ResponseHandler.error(res, error.message,400);
  }
}
  
}