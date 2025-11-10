"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.addWishlistItem = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const addWishlistItem = async (req, res) => {
    try {
        const { customerId, productId, variantId, handle, title } = req.body;
        if (!customerId || !productId) {
            return res.status(400).json({
                message: "customerId and productId are required",
            });
        }
        const numericCustomerId = Number(customerId);
        if (isNaN(numericCustomerId)) {
            return res.status(400).json({
                message: "customerId must be a valid number",
            });
        }
        const customer = await prisma_1.default.customer.findUnique({
            where: { id: numericCustomerId },
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const existing = await prisma_1.default.wishlistItem.findFirst({
            where: {
                customerId: numericCustomerId,
                productId: String(productId),
            },
        });
        if (existing) {
            return res.status(400).json({ message: "Item already in wishlist" });
        }
        const item = await prisma_1.default.wishlistItem.create({
            data: {
                customerId: numericCustomerId,
                productId: String(productId),
                variantId: variantId ? String(variantId) : null,
                productTitle: title || "",
                productHandle: handle || "",
                productImage: "",
                productPrice: null,
            },
        });
        return res.status(201).json({
            message: "Wishlist item added",
            item,
        });
    }
    catch (error) {
        console.error("Add wishlist error:", error);
        return res.status(500).json({
            error: "Failed to add wishlist item",
        });
    }
};
exports.addWishlistItem = addWishlistItem;
const getWishlist = async (req, res) => {
    try {
        const { customerId } = req.params;
        if (!customerId) {
            return res.status(400).json({ message: "customerId is required" });
        }
        const numericCustomerId = Number(customerId);
        if (isNaN(numericCustomerId)) {
            return res.status(400).json({
                message: "customerId must be a valid number",
            });
        }
        const customer = await prisma_1.default.customer.findUnique({
            where: { id: numericCustomerId },
            include: {
                wishlist: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        return res.json({
            success: true,
            customerId: customer.id,
            name: customer.name,
            totalItems: customer.wishlist.length,
            wishlist: customer.wishlist.map((item) => ({
                id: item.id,
                productId: item.productId,
                variantId: item.variantId,
                productTitle: item.productTitle,
                productHandle: item.productHandle,
                productImage: item.productImage,
                productPrice: item.productPrice,
                createdAt: item.createdAt,
            })),
        });
    }
    catch (error) {
        console.error("Get wishlist error:", error);
        return res.status(500).json({ error: "Failed to fetch wishlist" });
    }
};
exports.getWishlist = getWishlist;
