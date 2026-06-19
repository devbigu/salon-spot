/*
  Warnings:

  - You are about to alter the column `debit` on the `CustomerTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `credit` on the `CustomerTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- CreateEnum
CREATE TYPE "CustomerTransactionType" AS ENUM ('INVOICE', 'PAYMENT', 'WALLET_ADD', 'WALLET_USED', 'REFUND', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "CustomerTransaction" ADD COLUMN     "balanceAfter" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "invoiceId" TEXT,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "type" "CustomerTransactionType" NOT NULL DEFAULT 'ADJUSTMENT',
ALTER COLUMN "debit" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "credit" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "status" SET DEFAULT 'COMPLETE';

-- CreateIndex
CREATE INDEX "CustomerTransaction_customerId_idx" ON "CustomerTransaction"("customerId");

-- CreateIndex
CREATE INDEX "CustomerTransaction_salonId_idx" ON "CustomerTransaction"("salonId");

-- CreateIndex
CREATE INDEX "CustomerTransaction_invoiceId_idx" ON "CustomerTransaction"("invoiceId");

-- CreateIndex
CREATE INDEX "CustomerTransaction_paymentId_idx" ON "CustomerTransaction"("paymentId");

-- CreateIndex
CREATE INDEX "CustomerTransaction_type_idx" ON "CustomerTransaction"("type");

-- CreateIndex
CREATE INDEX "CustomerTransaction_createdAt_idx" ON "CustomerTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "CustomerTransaction" ADD CONSTRAINT "CustomerTransaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTransaction" ADD CONSTRAINT "CustomerTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
