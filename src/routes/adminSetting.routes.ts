import express from "express";
import {
  saveSettings,
  getSettings,
} from "../controllers/adminSettingController";
import { verifyShopifyProxy } from "../middleware/auth.middleware";

const router = express.Router();
// router.use(verifyApiKey);
// router.use(verifyShopifyProxy);
router.post("/save", verifyShopifyProxy, saveSettings);
router.get("/", verifyShopifyProxy, getSettings);

export default router;
