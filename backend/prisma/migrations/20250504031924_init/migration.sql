-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otp_expires" TIMESTAMP(3),
ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_expires" TIMESTAMP(3);
