-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codechefRating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "codechefStars" TEXT,
ADD COLUMN     "leetcodeRating" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SubmissionActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SubmissionActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubmissionActivity_userId_platform_idx" ON "SubmissionActivity"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionActivity_userId_platform_date_key" ON "SubmissionActivity"("userId", "platform", "date");

-- AddForeignKey
ALTER TABLE "SubmissionActivity" ADD CONSTRAINT "SubmissionActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
