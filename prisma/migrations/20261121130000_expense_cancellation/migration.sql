-- AlterEnum
ALTER TYPE "ExpenseStatus" ADD VALUE 'cancelled';

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledById" TEXT;

-- CreateIndex
CREATE INDEX "expenses_cancelledById_idx" ON "expenses"("cancelledById");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

