import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { Prisma } from "@prisma/client";

const TRANSLATABLE_KEYS = [
  "productButtonText",
  "productButtonAfterText",
  "pageHeading",
  "addToCartText",
] as const;

const LOCALE_REGEX = /^[a-z]{2}(-[A-Z]{2})?$/;

const getTranslation = (field: unknown, locale: string): string => {
  if (!field || typeof field !== "object" || Array.isArray(field)) return "";
  const dict = field as Record<string, string>;
  return dict[locale] || dict["en"] || "";
};

export const saveSettings = async (req: Request, res: Response) => {
  try {
    const { shop, locale = "en", settings } = req.body;

    if (!shop || !settings || typeof settings !== "object") {
      return res
        .status(400)
        .json({ message: "Shop domain and settings object required." });
    }

    if (!LOCALE_REGEX.test(locale)) {
      return res.status(400).json({ message: "Invalid locale format." });
    }

    const shopRecord = await prisma.shop.findUnique({
      where: { shopifyDomain: shop },
      include: { settings: true },
    });

    if (!shopRecord) {
      return res.status(404).json({ message: "Shop not found." });
    }

    const existingSettings = shopRecord.settings;
    const dataToSave: Record<string, any> = { ...settings };

    for (const key of TRANSLATABLE_KEYS) {
      if (key in settings) {
        const incomingValue = settings[key];

        if (typeof incomingValue !== "string") {
          return res.status(400).json({
            message: `Field '${key}' must be a string.`,
          });
        }

        const rawValue = existingSettings?.[key];

        const currentJson =
          rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
            ? (rawValue as Record<string, any>)
            : {};

        dataToSave[key] = {
          ...currentJson,
          [locale]: incomingValue,
        };
      }
    }

    const result = await prisma.shopSettings.upsert({
      where: { shopId: shopRecord.id },
      create: {
        shopId: shopRecord.id,
        ...dataToSave,
      },
      update: {
        ...dataToSave,
      },
    });

    return res.status(200).json({
      message: "Settings saved successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.warn("Invalid settings field sent:", error.message);
      return res.status(400).json({
        message: "Invalid field in settings object.",
      });
    }
    console.error("Error saving settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    const locale = (req.query.locale as string) || "en";
    const shop = String(req.query.shop);

    if (!req.query.shop) {
      return res.status(400).json({ message: "Shop domain is required." });
    }

    const shopData = await prisma.shop.findUnique({
      where: { shopifyDomain: shop },
      select: {
        settings: true,
      },
    });

    if (!shopData || !shopData.settings) {
      return res.status(404).json({ message: "Settings not found." });
    }

    const settings = shopData.settings;

    const formatted = {
      basic: {
        showWishlistCount: settings.showWishlistCount,
        pageHeading: getTranslation(settings.pageHeading, locale),
      },
      product: {
        buttonColor: settings.buttonColor,
        textColor: settings.textColor,
        productShowIcon: settings.productShowIcon,
        productButtonText: getTranslation(settings.productButtonText, locale),
        productButtonAfterText: getTranslation(
          settings.productButtonAfterText,
          locale
        ),
        addToCartText: getTranslation(settings.addToCartText, locale),

        productButtonPosition: settings.productButtonPosition,
        productButtonStyle: settings.productButtonStyle,
        showAddToCart: settings.showAddToCart,
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
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
