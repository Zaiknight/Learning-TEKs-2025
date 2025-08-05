import { Router } from "express";
import { OrderController } from "../controllers/orders.controller";

const router = Router();

router.post("/", OrderController.create);

router.post("/:email", OrderController.createGuest);

router.get("/:email",OrderController.GetByEmail);

router.get("/", OrderController.getAll)

router.patch("/:id", OrderController.update);


export default router;