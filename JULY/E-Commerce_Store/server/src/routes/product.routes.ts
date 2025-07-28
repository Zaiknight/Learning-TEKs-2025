import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();
// /products

router.get("/",ProductController.getAll);
router.get("/:id", ProductController.getById);
router.get("/name/:name", ProductController.getByName);

router.post('/', upload.single('image'), ProductController.create);


router.put("/:id",ProductController.update);

router.delete("/:id", ProductController.delete);

export default router;
