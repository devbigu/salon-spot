/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `lastVisitAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `loyaltyPoints` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `totalVisits` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[salonId,customerCode]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salonId,email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerCode` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('REGULAR', 'PREMIUM', 'IRREGULAR');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED');

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "dateOfBirth",
DROP COLUMN "gender",
DROP COLUMN "lastVisitAt",
DROP COLUMN "loyaltyPoints",
DROP COLUMN "notes",
DROP COLUMN "totalVisits",
ADD COLUMN     "anniversaryDate" TIMESTAMP(3),
ADD COLUMN     "customerCode" TEXT NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "outstandingAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'REGULAR',
ADD COLUMN     "walletBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CustomerTransaction" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,
    "billNo" TEXT,
    "narration" TEXT NOT NULL,
    "debit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "credit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_salonId_customerCode_key" ON "Customer"("salonId", "customerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_salonId_email_key" ON "Customer"("salonId", "email");

-- AddForeignKey
ALTER TABLE "CustomerTransaction" ADD CONSTRAINT "CustomerTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTransaction" ADD CONSTRAINT "CustomerTransaction_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
