import { Router } from "express";
import { cartItemController } from "../controllers/cartItems.controller";

const router = Router();

router.post("/",cartItemController.create);

router.get("/:cart_id",cartItemController.getByCartId);

router.delete("/:id",cartItemController.delete);

router.patch("/add/:id",cartItemController.addQuantity);
router.patch("/sub/:id",cartItemController.subQuantity);


export default router;