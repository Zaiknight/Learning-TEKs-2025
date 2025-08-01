import { Router } from "express";
import { orderItemController } from "../controllers/orderItems.controller";

const router = Router();

router.post("/",orderItemController.create);

router.get("/:order_id",orderItemController.getByorderId);

router.delete("/:id",orderItemController.delete);

export default router;