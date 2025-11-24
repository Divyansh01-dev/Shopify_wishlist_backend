-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "buttonColor" TEXT,
    "textColor" TEXT,
    "iconFillColor" TEXT,
    "iconStyle" TEXT,
    "showWishlistCount" BOOLEAN DEFAULT true,
    "productIconFillColor" TEXT,
    "productShpwIcon" BOOLEAN DEFAULT true,
    "productButtonText" TEXT,
    "productButtonPosition" TEXT,
    "productButtonStyle" TEXT,
    "collectionIconFillColor" TEXT,
    "collectionShowIcon" BOOLEAN DEFAULT true,
    "collectionButtonPosition" TEXT,
    "wishlistLayoutType" TEXT,
    "showPrice" BOOLEAN DEFAULT true,
    "showStock" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettings_shopId_key" ON "ShopSettings"("shopId");

-- AddForeignKey
ALTER TABLE "ShopSettings" ADD CONSTRAINT "ShopSettings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
