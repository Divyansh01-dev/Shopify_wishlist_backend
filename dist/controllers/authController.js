"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthInfo = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const getAuthInfo = async (req, res) => {
    const { accessToken, shop } = req.body;
    if (!accessToken || !shop) {
        res
            .status(400)
            .json({ message: "access token and shop domain is required." });
        return;
    }
    console.log("req body: ", req.body);
    console.log("req header: ", req.headers);
    try {
        console.log("Authentication API");
        const existingShop = await prisma_1.default.shop.findUnique({
            where: { shopifyDomain: shop },
        });
        if (existingShop) {
            await prisma_1.default.shop.update({
                where: { shopifyDomain: shop },
                data: {
                    accessToken,
                    isActive: true,
                    uninstalledAt: null,
                },
            });
            res.status(200).json({ message: "Shop Updated" });
            return;
        }
        const data = await prisma_1.default.shop.create({
            data: {
                shopifyDomain: shop,
                accessToken,
            },
        });
        res.status(201).json({ message: "shop installed", data });
    }
    catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};
exports.getAuthInfo = getAuthInfo;
