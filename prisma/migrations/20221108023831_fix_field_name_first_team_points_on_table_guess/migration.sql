/*
  Warnings:

  - You are about to drop the column `fisrtTeamPoints` on the `guess` table. All the data in the column will be lost.
  - Added the required column `firstTeamPoints` to the `guess` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstTeamPoints" INTEGER NOT NULL,
    "secondTeamPoints" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    CONSTRAINT "guess_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "guess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_guess" ("createdAt", "gameId", "id", "participantId", "secondTeamPoints") SELECT "createdAt", "gameId", "id", "participantId", "secondTeamPoints" FROM "guess";
DROP TABLE "guess";
ALTER TABLE "new_guess" RENAME TO "guess";
CREATE UNIQUE INDEX "guess_participantId_gameId_key" ON "guess"("participantId", "gameId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
