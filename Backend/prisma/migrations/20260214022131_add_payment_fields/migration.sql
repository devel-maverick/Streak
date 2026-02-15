-- AlterTable
ALTER TABLE "User" ADD COLUMN     "razorpayCustomerId" TEXT,
ADD COLUMN     "razorpaySubscriptionId" TEXT,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3);
