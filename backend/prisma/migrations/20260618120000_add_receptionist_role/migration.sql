ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'RECEPTIONIST';

ALTER TABLE "Appointment"
ADD COLUMN "createdById" TEXT;

CREATE INDEX "Appointment_createdById_idx"
ON "Appointment"("createdById");

ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_createdById_fkey"
FOREIGN KEY ("createdById")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
