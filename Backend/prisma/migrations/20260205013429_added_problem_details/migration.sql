-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "acceptance" DOUBLE PRECISION,
ADD COLUMN     "frequency" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Problem_platform_idx" ON "Problem"("platform");

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");
