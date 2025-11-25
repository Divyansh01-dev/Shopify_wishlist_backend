import { Router } from "express";
import { getAuthInfo, uninstallStore } from "../controllers/authController";
import { verifyShopifyProxy } from "../middleware/auth.middleware";

const router = Router();
// router.use(verifyShopifyProxy);
router.post("/", getAuthInfo);
router.post("/app-uninstalled", uninstallStore);

export default router;
