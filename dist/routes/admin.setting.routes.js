"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminSettingController_1 = require("../controllers/adminSettingController");
const router = express_1.default.Router();
router.post("/save", adminSettingController_1.saveSettings);
router.get("/", adminSettingController_1.getSettings);
exports.default = router;
