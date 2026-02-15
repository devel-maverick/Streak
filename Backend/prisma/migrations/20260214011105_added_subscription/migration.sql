/*
  Warnings:

  - The values [ATCODER] on the enum `Platform` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `solvedAtcoder` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `solvedCses` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO');

-- AlterEnum
BEGIN;
CREATE TYPE "Platform_new" AS ENUM ('LEETCODE', 'CODEFORCES', 'CODECHEF', 'CSES');
ALTER TABLE "SubmissionActivity" ALTER COLUMN "platform" TYPE "Platform_new" USING ("platform"::text::"Platform_new");
ALTER TABLE "Problem" ALTER COLUMN "platform" TYPE "Platform_new" USING ("platform"::text::"Platform_new");
ALTER TABLE "Contest" ALTER COLUMN "platform" TYPE "Platform_new" USING ("platform"::text::"Platform_new");
ALTER TYPE "Platform" RENAME TO "Platform_old";
ALTER TYPE "Platform_new" RENAME TO "Platform";
DROP TYPE "Platform_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "solvedAtcoder",
DROP COLUMN "solvedCses",
ADD COLUMN     "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';
