-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "adjustedAt" TIMESTAMP(3),
ADD COLUMN     "adjustedById" TEXT,
ADD COLUMN     "originalCommission" DOUBLE PRECISION,
ADD COLUMN     "originalSellingPrice" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "sales_adjustedById_idx" ON "sales"("adjustedById");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_adjustedById_fkey" FOREIGN KEY ("adjustedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
