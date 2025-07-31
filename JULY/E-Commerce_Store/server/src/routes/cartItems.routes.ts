import { Router } from "express";
import { cartItemController } from "../controllers/cartItems.controller";


const router = Router();

router.post("/",cartItemController.create);

router.delete("/:id",cartItemController.delete);

export default router;