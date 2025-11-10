/*
  Warnings:

  - You are about to drop the column `productName` on the `WishlistItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopifyId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productTitle` to the `WishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "shopifyId" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WishlistItem" DROP COLUMN "productName",
ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "productPrice" DOUBLE PRECISION,
ADD COLUMN     "productTitle" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_shopifyId_key" ON "Customer"("shopifyId");
