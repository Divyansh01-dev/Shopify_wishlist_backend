"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyShopifyProxy = void 0;
const crypto_1 = __importDefault(require("crypto"));
const verifyShopifyProxy = (req, res, next) => {
    try {
        const secret = process.env.SHOPIFY_API_SECRET;
        if (!secret) {
            return res.status(500).json({ error: "Missing Shopify secret" });
        }
        const query = req.query;
        const { signature, ...rest } = query;
        if (!signature) {
            return res.status(403).json({ error: "Missing signature" });
        }
        const message = Object.keys(rest)
            .sort()
            .map((key) => `${key}=${rest[key]}`)
            .join("");
        const generated = crypto_1.default
            .createHmac("sha256", secret)
            .update(message)
            .digest("hex");
        if (generated !== signature) {
            return res.status(403).json({ error: "Invalid signature" });
        }
        next();
    }
    catch (error) {
        console.error("Proxy verification failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.verifyShopifyProxy = verifyShopifyProxy;
