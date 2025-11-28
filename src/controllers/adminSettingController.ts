import { Request, Response } from "express";
import prisma from "../db/prisma";

export const saveSettings = async (req: Request, res: Response) => {
  try {
    const { shop, settings } = req.body;
    const query = req.query;
    console.log("full query add setting:", query);
    if (!shop || !settings) {
      return res
        .status(400)
        .json({ message: "Shop domain and settings are required." });
    }

    const shopRecord = await prisma.shop.findUnique({
      where: { shopifyDomain: shop },
    });

    if (!shopRecord) {
      return res.status(404).json({ message: "Shop not found." });
    }

    const existingSettings = await prisma.shopSettings.findUnique({
      where: { shopId: shopRecord.id },
    });

    let updatedSettings;

    if (existingSettings) {
      updatedSettings = await prisma.shopSettings.update({
        where: { shopId: shopRecord.id },
        data: {
          ...settings,
        },
      });
    } else {
      updatedSettings = await prisma.shopSettings.create({
        data: {
          shopId: shopRecord.id,
          ...settings,
        },
      });
    }

    res
      .status(200)
      .json({ message: "Settings saved successfully", data: updatedSettings });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    const { shop } = req.query;
    const query = req.query;
    console.log("full query get settng", query);
    if (!shop) {
      return res.status(400).json({ message: "Shop domain is required." });
    }

    const shopRecord = await prisma.shop.findUnique({
      where: { shopifyDomain: String(shop) },
    });

    if (!shopRecord) {
      return res.status(404).json({ message: "Shop not found." });
    }

    const settings = await prisma.shopSettings.findUnique({
      where: { shopId: shopRecord.id },
    });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found." });
    }

    const formattedSettings = {
      basic: {
        showWishlistCount: settings.showWishlistCount,
        pageHeading: settings.pageHeading,
      },

      product: {
        buttonColor: settings.buttonColor,
        textColor: settings.textColor,
        productShowIcon: settings.productShowIcon,
        productButtonText: settings.productButtonText,
        productButtonAfterText: settings.productButtonAfterText,
        productButtonPosition: settings.productButtonPosition,
        productButtonStyle: settings.productButtonStyle,
        showAddToCart: settings.showAddToCart,
        addToCartText: settings.addToCartText,
      },

      collection: {
        collectionShowIcon: settings.collectionShowIcon,
        collectionButtonPosition: settings.collectionButtonPosition,
      },

      wishlist: {
        wishlistLayoutType: settings.wishlistLayoutType,
        showPrice: settings.showPrice,
      },
    };

    return res.status(200).json({
      message: "Settings fetched successfully",
      data: formattedSettings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
