"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlistCustomerAnalytics = exports.getWishlistProductAnalytics = void 0;
const prisma_1 = require("../db/prisma");
const getWishlistProductAnalytics = async (req, res) => {
    const { shopifyDomain } = req.params;
    const { limit, from, to } = req.query;
    if (!shopifyDomain) {
        res.status(400).json({ message: "Shopify domain is required." });
        return;
    }
    try {
        const shop = await prisma_1.prisma.shop.findUnique({
            where: { shopifyDomain },
        });
        if (!shop) {
            res.status(404).json({ message: "Shop not found." });
            return;
        }
        const dateFilter = from || to
            ? {
                createdAt: {
                    ...(from && { gte: new Date(from) }),
                    ...(to && { lte: new Date(to) }),
                },
            }
            : {};
        const products = await prisma_1.prisma.wishlistItem.groupBy({
            by: ["productId", "productTitle", "productImage", "productHandle"],
            where: {
                shopId: shop.id,
                ...dateFilter,
            },
            _count: {
                productId: true,
                customerId: true,
            },
            orderBy: {
                _count: {
                    productId: "desc",
                },
            },
            take: limit ? Number(limit) : 20,
        });
        res.status(200).json({ products });
    }
    catch (error) {
        console.error("Wishlist product analytics error:", error);
        res.status(500).json({ message: "Something went wrong." });
    }
};
exports.getWishlistProductAnalytics = getWishlistProductAnalytics;
const getWishlistCustomerAnalytics = async (req, res) => {
    const { shopifyDomain } = req.params;
    const { limit } = req.query;
    if (!shopifyDomain) {
        res.status(400).json({ message: "Shopify domain is required." });
        return;
    }
    try {
        const shop = await prisma_1.prisma.shop.findUnique({
            where: { shopifyDomain },
        });
        if (!shop) {
            res.status(404).json({ message: "Shop not found." });
            return;
        }
        const customers = await prisma_1.prisma.wishlistItem.groupBy({
            by: ["customerId"],
            where: {
                shopId: shop.id,
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: limit ? Number(limit) : 20,
        });
        const customerDetails = await prisma_1.prisma.customer.findMany({
            where: {
                shopId: shop.id,
                shopifyId: {
                    in: customers.map((c) => c.customerId),
                },
            },
            select: {
                shopifyId: true,
                name: true,
                email: true,
                phone: true,
            },
        });
        const result = customers.map((c) => ({
            customerId: c.customerId,
            wishlistCount: c._count.id,
            customer: customerDetails.find((cd) => cd.shopifyId === c.customerId),
        }));
        res.status(200).json({ customers: result });
    }
    catch (error) {
        console.error("Wishlist customer analytics error:", error);
        res.status(500).json({ message: "Something went wrong." });
    }
};
exports.getWishlistCustomerAnalytics = getWishlistCustomerAnalytics;
