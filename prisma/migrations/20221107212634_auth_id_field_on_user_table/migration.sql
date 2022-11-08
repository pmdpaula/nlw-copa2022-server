/*
  Warnings:

  - A unique constraint covering the columns `[authId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN "authId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_authId_key" ON "user"("authId");
