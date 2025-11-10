import { WishlistItemInput } from "../utils/types";
import { Request, Response } from "express";
import prisma from "../db/prisma";

export const addWishlistItem = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("Request Body:", data);

    const { customerId, productId, variantId, title, handle } =
      data as WishlistItemInput;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID missing" });
    }

    console.log("Customer ID →", customerId);

    let customer = await prisma.customer.findUnique({
      where: { shopifyId: customerId },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { shopifyId: customerId },
      });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID missing" });
    }

    const exists = await prisma.wishlistItem.findFirst({
      where: {
        customerId,
        productId: productId,
      },
    });

    if (exists) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    await prisma.wishlistItem.create({
      data: {
        customerId,
        productId: productId,
        variantId,
        productTitle: title,
        productHandle: handle,
      },
    });

    return res.json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Wishlist Add Error:", error);
    return res.status(500).json({ error: "Failed to add wishlist item" });
  }
};

export const getWishlistItems = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    if (!customerId)
      return res.status(400).json({ message: "customer id is required." });

    const items = await prisma.wishlistItem.findMany({
      where: { customerId },
    });

    if (!items || items.length === 0)
      return res.status(404).json({ message: "No wishlist items found." });

    return res.status(200).json({ data: items });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const removeItemFromWishlist = async (req: Request, res: Response) => {
  try {
    const { customerId, variantId } = req.params;

    if (!customerId || !variantId)
      return res
        .status(400)
        .json({ message: "customer id and variant id is required." });

    const result = await prisma.wishlistItem.deleteMany({
      where: { AND: [{ customerId }, { variantId }] },
    });

    return res.json({
      message: "Wishlist item removed successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
