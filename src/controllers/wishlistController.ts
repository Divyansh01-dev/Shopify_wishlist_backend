import { WishlistItemInput } from "../utils/types";
import { Request, Response } from "express";
import prisma from "../db/prisma";

export const addWishlistItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    shopifyDomain,
    customerId,
    productId,
    variantId,
    title,
    handle,
    image,
    price,
    name,
    email,
    phone,
  } = req.body;
  console.log("====================================");
  console.log("req.body", req.body);
  console.log("====================================");
  const query = req.query;
  console.log("full query add to wishlist product:", query);
  if (!shopifyDomain || !customerId || !productId || !variantId || !title) {
    res.status(400).json({ message: "Missing data fields." });
    return;
  }

  try {
    const shop = await prisma.shop.findUnique({
      where: { shopifyDomain },
    });

    if (!shop) {
      res.status(404).json({ message: "Shop not found." });
      return;
    }

    let customer = await prisma.customer.findFirst({
      where: {
        shopId: shop.id,
        shopifyId: customerId,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          shopifyId: customerId,
          shopId: shop.id,
          name: name,
          email: email,
          phone: phone,
        },
      });
    }

    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        shopId: shop.id,
        customerId,
        variantId,
      },
    });

    if (existingItem) {
      res
        .status(400)
        .json({ message: "Product already added to  wishlist.", existingItem });
      return;
    }

    await prisma.wishlistItem.create({
      data: {
        customerId,
        productId,
        variantId,
        productTitle: title,
        productHandle: handle,
        productImage: image,
        productPrice: price,
        shopId: shop.id,
      },
    });

    res.status(201).json({ message: "Added to wishlist!" });
    return;
  } catch (error) {
    console.error("Wishlist add error:", error);
    res.status(500).json({ message: "Error occured.", error });
  }
};

export const getWishlistItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { shopifyDomain, customerId } = req.params;
  const query = req.query;
  console.log("full query get to wishlist product:", query);
  if (!shopifyDomain || !customerId) {
    res
      .status(400)
      .json({ message: "Shopify domain and customer id is required." });
    return;
  }

  try {
    const shop = await prisma.shop.findUnique({
      where: { shopifyDomain },
    });

    if (!shop) {
      res.status(404).json({ message: "Shop not found." });
      return;
    }

    const items = await prisma.wishlistItem.findMany({
      where: {
        shopId: shop.id,
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ items });
  } catch (error) {
    console.error("Get wishlist items error:", error);
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

export const removeItemFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { shopifyDomain, customerId, variantId } = req.params;
  const query = req.query;
  console.log("full query remove to wishlist product:", query);
  if (!shopifyDomain || !customerId || !variantId) {
    res.status(400).json({
      message: "Shopify domain, customer id and variant is required.",
    });
    return;
  }

  try {
    const shop = await prisma.shop.findUnique({
      where: { shopifyDomain },
    });

    if (!shop) {
      res.status(404).json({ message: "Shop not found." });
      return;
    }

    const result = await prisma.wishlistItem.deleteMany({
      where: {
        shopId: shop.id,
        customerId,
        variantId,
      },
    });

    res
      .status(200)
      .json({ message: "Items removed from wishlist.", count: result.count });
  } catch (error) {
    console.error("Remove wishlist item error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
