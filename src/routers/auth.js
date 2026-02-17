import { Router } from "express";
import * as authController from "../controllers/auth.js";

const router = Router();

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/refresh", authController.refreshController);
router.post("/logout", authController.logoutController);

export default router;
