-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('BEFORE', 'CODING', 'ENDED');

-- AlterTable
ALTER TABLE "Problem" ALTER COLUMN "difficulty" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "contestId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "phase" "Phase" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contest_platform_contestId_key" ON "Contest"("platform", "contestId");
