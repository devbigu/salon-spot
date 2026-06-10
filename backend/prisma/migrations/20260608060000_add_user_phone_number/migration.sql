-- AlterTable
ALTER TABLE "User" ADD COLUMN "phone_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");
