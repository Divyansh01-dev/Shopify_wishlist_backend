import { WishlistItemInput, ShopifyAuthenticatedHeaders } from "../utils/types";
import { Request, Response } from "express";
import prisma from "../db/prisma";

export const addWishlistItem = async (req: Request, res: Response) => {
  try {
    const headers = req.headers as ShopifyAuthenticatedHeaders;
    const rawCustomerId =
      headers["x-shopify-authenticated-user-id"] ||
      headers["x-shopify-user-id"];

    if (!rawCustomerId)
      return res.status(401).json({ message: "Customer not logged in" });

    const customerIdStr = Array.isArray(rawCustomerId)
      ? rawCustomerId[0]
      : rawCustomerId;
    const customerId = Number(customerIdStr);
    if (isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customerId" });
    }

    const { productId, variantId, title, handle } =
      req.body as WishlistItemInput;

    const exists = await prisma.wishlistItem.findFirst({
      where: { customerId, productId },
    });

    if (exists)
      return res.status(400).json({ message: "Item already in wishlist" });

    await prisma.wishlistItem.create({
      data: {
        customerId,
        productId,
        variantId,
        productTitle: title,
        productHandle: handle,
      },
    });

    return res.json({ message: "Added to wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
