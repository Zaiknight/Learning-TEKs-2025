import { Request, Response } from "express";
import { OrderService } from "../services/orders.service";
import { ResponseHandler } from "../utils/response";
import { OrderDTO } from "../models/orders.model";

export const OrderController = {
  async getAll(req: Request, res: Response){
    try {
      const orders = await OrderService.getAll();
      if(!orders){
        return ResponseHandler.error(res, 'Orders not found', 404);
      }
      return ResponseHandler.success(res, 'Orders fetched successfully',200, orders);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  },

  async create(req:Request, res: Response){
    try {
      const orderData = req.body;
      if(!orderData){
        return ResponseHandler.error(res, "Error: Data Error",422);
      }
      const parsedData = OrderDTO.parse(orderData);
      
      const order = await OrderService.createOrder(parsedData);
      return ResponseHandler.success(res, "Order Created", 200, order)
    } catch (error:any) {
      return ResponseHandler.error(res,error.message, 422)
    }
  },
 
  async createGuest(req:Request, res: Response){
    try {
        const email = String(req.params.email)
        const order = await OrderService.CreateGuestOrder(email);
        return ResponseHandler.success(res, "Order Created", 200, order);
    } catch (error : any) {
        return ResponseHandler.error(res,error.message, 403)
    }
  },

  async GetByEmail(req:Request, res:Response){
    try {
      const email = String(req.params.email);
      const Order = await OrderService.GetByEmail(email);
      if (!Order) {
        return ResponseHandler.error(res, 'Orders not found', 404);
      }
      return ResponseHandler.success(res, 'Orders fetched successfully',200, Order);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message,500);
    }
  },

  async update(req: Request, res: Response){
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updated = await OrderService.updateOrder(id, data);
      if(!updated){
        return ResponseHandler.error(res, 'Order not found', 404);
      }
      return ResponseHandler.success(res, 'Order updated successfully',200, updated);
    } catch (error:any) {
      return ResponseHandler.error(res, error.message, 500);
    }
  }
}