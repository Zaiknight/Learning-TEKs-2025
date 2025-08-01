import { Router } from "express";
import { UserAddressController } from "../controllers/userAddress.controller";

const router = Router()

router.post('/',UserAddressController.create);

export default router;
