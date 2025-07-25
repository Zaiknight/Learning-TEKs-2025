import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();
// /products

router.get("/",ProductController.getAll);
router.get("/:id", ProductController.getById);
router.get("/name/:name", ProductController.getByName);

router.post("/", ProductController.create);

router.put("/:id",ProductController.update);

router.delete("/:id", ProductController.delete);

export default router;
