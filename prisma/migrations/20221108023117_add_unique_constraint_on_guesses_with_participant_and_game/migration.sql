/*
  Warnings:

  - A unique constraint covering the columns `[participantId,gameId]` on the table `guess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "guess_participantId_gameId_key" ON "guess"("participantId", "gameId");
