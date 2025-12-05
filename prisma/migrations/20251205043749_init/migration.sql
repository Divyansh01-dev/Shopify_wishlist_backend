/*
  Warnings:

  - The `productButtonText` column on the `ShopSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `addToCartText` column on the `ShopSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pageHeading` column on the `ShopSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `productButtonAfterText` column on the `ShopSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ShopSettings" DROP COLUMN "productButtonText",
ADD COLUMN     "productButtonText" JSONB,
DROP COLUMN "addToCartText",
ADD COLUMN     "addToCartText" JSONB,
DROP COLUMN "pageHeading",
ADD COLUMN     "pageHeading" JSONB,
DROP COLUMN "productButtonAfterText",
ADD COLUMN     "productButtonAfterText" JSONB;
