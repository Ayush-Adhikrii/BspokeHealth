/*
  Warnings:

  - You are about to drop the column `document_url` on the `KYC` table. All the data in the column will be lost.
  - Added the required column `citizenship_back` to the `KYC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizenship_front` to the `KYC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permanent_address` to the `KYC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `KYC` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KYC" DROP COLUMN "document_url",
ADD COLUMN     "citizenship_back" TEXT NOT NULL,
ADD COLUMN     "citizenship_front" TEXT NOT NULL,
ADD COLUMN     "permanent_address" TEXT NOT NULL,
ADD COLUMN     "review_notes" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ADD COLUMN     "temporary_address" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
