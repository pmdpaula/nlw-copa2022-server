/*
  Warnings:

  - You are about to drop the `pool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `poolId` on the `participant` table. All the data in the column will be lost.
  - Added the required column `pollId` to the `participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "pool_code_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pool";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "poll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "creatAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT,
    CONSTRAINT "poll_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    CONSTRAINT "participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "participant_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_participant" ("id", "userId") SELECT "id", "userId" FROM "participant";
DROP TABLE "participant";
ALTER TABLE "new_participant" RENAME TO "participant";
CREATE UNIQUE INDEX "participant_userId_pollId_key" ON "participant"("userId", "pollId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "poll_code_key" ON "poll"("code");
