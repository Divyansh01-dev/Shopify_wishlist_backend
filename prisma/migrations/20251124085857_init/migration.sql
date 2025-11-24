/*
  Warnings:

  - You are about to drop the column `collectionIconFillColor` on the `ShopSettings` table. All the data in the column will be lost.
  - You are about to drop the column `iconFillColor` on the `ShopSettings` table. All the data in the column will be lost.
  - You are about to drop the column `iconStyle` on the `ShopSettings` table. All the data in the column will be lost.
  - You are about to drop the column `productIconFillColor` on the `ShopSettings` table. All the data in the column will be lost.
  - You are about to drop the column `productShpwIcon` on the `ShopSettings` table. All the data in the column will be lost.
  - You are about to drop the column `showStock` on the `ShopSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopSettings" DROP COLUMN "collectionIconFillColor",
DROP COLUMN "iconFillColor",
DROP COLUMN "iconStyle",
DROP COLUMN "productIconFillColor",
DROP COLUMN "productShpwIcon",
DROP COLUMN "showStock",
ADD COLUMN     "productShowIcon" BOOLEAN DEFAULT true;
