ALTER TABLE "Staff"
ADD COLUMN "staffCode" TEXT,
ADD COLUMN "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "Staff_salonId_staffCode_key"
ON "Staff"("salonId", "staffCode");
