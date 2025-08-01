import { Router } from "express";
import { OrderController } from "../controllers/orders.controller";

const router = Router();

router.post("/:email", OrderController.createGuest);

export default router;