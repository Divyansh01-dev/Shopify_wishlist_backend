import express from "express";
import {
  saveSettings,
  getSettings,
} from "../controllers/adminSettingController";
import { verifyApiKey } from "../middleware/auth.middleware";

const router = express.Router();
router.use(verifyApiKey);
router.post("/save", saveSettings);
router.get("/", getSettings);

export default router;
