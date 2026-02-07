/*
  Warnings:

  - Made the column `input` on table `CodeDraft` required. This step will fail if there are existing NULL values in that column.
  - Made the column `output` on table `CodeDraft` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AIMessageRole" AS ENUM ('user', 'ai');

-- AlterTable
ALTER TABLE "CodeDraft" ALTER COLUMN "code" SET DEFAULT '',
ALTER COLUMN "input" SET NOT NULL,
ALTER COLUMN "input" SET DEFAULT '',
ALTER COLUMN "output" SET NOT NULL,
ALTER COLUMN "output" SET DEFAULT '';

-- CreateTable
CREATE TABLE "AIMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT,
    "message" TEXT NOT NULL,
    "role" "AIMessageRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
