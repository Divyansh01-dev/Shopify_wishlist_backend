"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyShopKey = void 0;
const prisma_1 = require("../db/prisma");
const verifyShopKey = async (req, res, next) => {
    const shopRaw = req.header("x-shop-domain");
    const key = req.header("x-auth-key");
    if (!shopRaw || !key) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const shop = Array.isArray(shopRaw) ? String(shopRaw[0]) : String(shopRaw);
    const store = await prisma_1.prisma.shop.findUnique({
        where: { shopifyDomain: shop },
    });
    console.log("authorized store", store);
    if (!store || store.internalApiKey !== key) {
        return res.status(401).json({ message: "Invalid key" });
    }
    next();
};
exports.verifyShopKey = verifyShopKey;
