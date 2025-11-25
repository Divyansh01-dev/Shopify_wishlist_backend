import { Router } from "express";
import {
  getAuthInfo,
  uninstallStore,
  login,
} from "../controllers/authController";
import { verifyShopKey } from "../middleware/auth.login";

const router = Router();
router.post("/", getAuthInfo);
router.post("/login", verifyShopKey, login);
router.post("/app-uninstalled", uninstallStore);

export default router;
