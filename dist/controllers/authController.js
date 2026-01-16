"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.uninstallStore = exports.getAuthInfo = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAuthInfo = async (req, res) => {
    const { accessToken, shop } = req.body;
    const query = req.query;
    console.log("full query get auth:", query);
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
        let internalApiKey = existingShop?.internalApiKey;
        if (!internalApiKey) {
            internalApiKey = crypto_1.default.randomBytes(32).toString("hex");
        }
        if (existingShop) {
            await prisma_1.default.shop.update({
                where: { shopifyDomain: shop },
                data: {
                    accessToken,
                    internalApiKey,
                    isActive: true,
                    uninstalledAt: null,
                },
            });
            res.status(200).json({ message: "Shop Updated", internalApiKey });
            return;
        }
        const data = await prisma_1.default.shop.create({
            data: {
                shopifyDomain: shop,
                accessToken,
                internalApiKey,
            },
        });
        res.status(201).json({ message: "shop installed", internalApiKey, data });
    }
    catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};
exports.getAuthInfo = getAuthInfo;
const uninstallStore = async (req, res) => {
    try {
        const shopDomain = req.headers["x-shopify-shop-domain"];
        if (!shopDomain) {
            return res.status(400).json({ message: "Shop domain missing" });
        }
        console.log("App uninstalled by:", shopDomain);
        const shop = await prisma_1.default.shop.findUnique({
            where: { shopifyDomain: shopDomain },
        });
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }
        const shopId = shop.id;
        await prisma_1.default.shop.delete({
            where: { id: shopId },
        });
        return res.status(200).json({ message: "Shop and related data deleted" });
    }
    catch (error) {
        console.error("Uninstall handler error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.uninstallStore = uninstallStore;
// export const login = async (req: Request, res: Response) => {
//   try {
//     const store = req.header("x-shop-domain");
//     console.log("login store", store);
//     const internalApiKey = req.header("x-auth-key");
//     if (!store || !internalApiKey) {
//       return res.status(400).json({ message: "Store not found" });
//     }
//     const payload = {
//       shop: store,
//       internalApiKey: internalApiKey,
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET!, {
//       expiresIn: "15m",
//     });
//     return res.status(200).json({
//       message: "Login successful",
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const login = async (req, res) => {
    try {
        const store = req.header("x-shop-domain");
        console.log("login store", store);
        const internalApiKey = req.header("x-auth-key");
        if (!store || !internalApiKey) {
            return res.status(400).json({ message: "Store not found" });
        }
        const payload = {
            shop: store,
            internalApiKey: internalApiKey,
        };
        const expiresIn = 15 * 60;
        const expiresAt = Date.now() + expiresIn * 1000;
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: expiresIn,
        });
        return res.status(200).json({
            message: "Login successful",
            token,
            expiresIn: "15m",
            expiresAt,
            expiresAtReadable: new Date(expiresAt).toISOString(),
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
