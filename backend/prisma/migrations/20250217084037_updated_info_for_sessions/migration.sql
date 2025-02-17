/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenHash]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Session_refreshToken_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refreshToken",
ADD COLUMN     "device" TEXT,
ADD COLUMN     "encryptedRefreshToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "tokenHash" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tokenIv" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
