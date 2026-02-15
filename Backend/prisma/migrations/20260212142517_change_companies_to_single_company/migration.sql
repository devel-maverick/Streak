/*
  Warnings:

  - You are about to drop the column `companies` on the `Problem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[platform,problemId,company]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Problem_platform_problemId_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "companies",
ADD COLUMN     "company" TEXT;

-- CreateIndex
CREATE INDEX "Problem_company_idx" ON "Problem"("company");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_platform_problemId_company_key" ON "Problem"("platform", "problemId", "company");
