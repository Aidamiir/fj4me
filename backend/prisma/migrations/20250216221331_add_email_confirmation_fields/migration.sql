-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmationExpiresAt" TIMESTAMP(3),
ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false;
