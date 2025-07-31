import { Router } from "express";
import { CartController } from "../controllers/cart.controller";


const router = Router();

router.get("/:user_id", CartController.getByUserId);

router.post("/",CartController.create);

router.delete("/:id",CartController.delete);

export default router;