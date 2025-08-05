import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.get("/",CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.get("/name/:name", CategoryController.getByName);

router.post("/",upload.single('image') ,CategoryController.create);

router.patch("/:id",CategoryController.update);

router.delete("/:id", CategoryController.delete);

export default router;

