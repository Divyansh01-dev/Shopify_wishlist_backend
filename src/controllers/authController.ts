import { Request, Response } from "express";
import prisma from "../db/prisma";

export const getAuthInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const existingShop = await prisma.shop.findUnique({
      where: { shopifyDomain: shop },
    });

    if (existingShop) {
      await prisma.shop.update({
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

    const data = await prisma.shop.create({
      data: {
        shopifyDomain: shop,
        accessToken,
      },
    });

    res.status(201).json({ message: "shop installed", data });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const uninstallStore = async (req: Request, res: Response) => {
  try {
    const shopDomain = req.headers["x-shopify-shop-domain"] as string;

    if (!shopDomain) {
      return res.status(400).json({ message: "Shop domain missing" });
    }

    console.log("App uninstalled by:", shopDomain);

    const shop = await prisma.shop.findUnique({
      where: { shopifyDomain: shopDomain },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shopId = shop.id;

    await prisma.shop.delete({
      where: { id: shopId },
    });

    return res.status(200).json({ message: "Shop and related data deleted" });
  } catch (error) {
    console.error("Uninstall handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
