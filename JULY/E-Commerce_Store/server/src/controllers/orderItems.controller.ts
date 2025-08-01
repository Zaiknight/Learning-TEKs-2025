import { Request, Response } from "express";
import { orderItemsService } from "../services/orderItems.service";
import { ResponseHandler } from "../utils/response";

export const orderItemController = {             
    async create(req:Request, res: Response){
        try {
          const order = await orderItemsService.create(req.body);
          return ResponseHandler.success(res, "Item Added", 200, order);
        } catch (error : any) {
          return ResponseHandler.error(res,error.message, 403)
        }
      },

    async getByorderId(req: Request, res: Response){
      try {
        const order_id = Number(req.params.order_id);
        const orderitems = await orderItemsService.GetByorderId(order_id)

        if(!orderitems){
          return ResponseHandler.error(res, 'Error: order Items Not Found', 404);
        }

        return ResponseHandler.success(res, "Success", 200, orderitems )
      } catch (error:any) {
        return ResponseHandler.error(res, error.message, 404);
      }
    },
  
      async delete(req:Request, res: Response){
          try {
            const id = Number(req.params.id);
            await orderItemsService.delete(id);
            return ResponseHandler.success(res, 'Item deleted successfully',204);
          } catch (error:any) {
            return ResponseHandler.error(res, error.message, 500);
          }
      },

}