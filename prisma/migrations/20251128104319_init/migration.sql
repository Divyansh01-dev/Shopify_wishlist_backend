-- AlterTable
ALTER TABLE "ShopSettings" ADD COLUMN     "addToCartText" TEXT,
ADD COLUMN     "pageHeading" TEXT,
ADD COLUMN     "productButtonAfterText" TEXT,
ADD COLUMN     "showAddToCart" BOOLEAN DEFAULT true;
