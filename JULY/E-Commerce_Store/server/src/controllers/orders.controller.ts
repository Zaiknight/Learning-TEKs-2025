import { Request, Response } from "express";
import { OrderService } from "../services/orders.service";
import { ResponseHandler } from "../utils/response";

export const OrderController = {

  async createGuest(req:Request, res: Response){
    try {
        const email = String(req.params.email)
        const order = await OrderService.CreateGuestOrder(email);
        return ResponseHandler.success(res, "Order Created", 200, order);
    } catch (error : any) {
        return ResponseHandler.error(res,error.message, 403)
    }
  },
}