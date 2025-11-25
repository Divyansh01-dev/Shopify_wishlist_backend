import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";

export const verifyShopKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shopRaw = req.header("x-shop-domain");
  const key = req.header("x-auth-key");

  if (!shopRaw || !key) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const shop = Array.isArray(shopRaw) ? String(shopRaw[0]) : String(shopRaw);

  const store = await prisma.shop.findUnique({
    where: { shopifyDomain: shop },
  });
  console.log("authorized store", store);

  if (!store || store.internalApiKey !== key) {
    return res.status(401).json({ message: "Invalid key" });
  }

  next();
};
