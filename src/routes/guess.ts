import { FastifyInstance } from 'fastify';
import z from 'zod';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export const guessRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  // Create a guess with score
  fastify.post(
    '/polls/:pollId/games/:gameId/guesses',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { pollId, gameId } = createGuessParams.parse(request.params);
      console.log('🚀 ~ file: guess.ts ~ line 32 ~ gameId', gameId);
      console.log('🚀 ~ file: guess.ts ~ line 32 ~ pollId', pollId);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body);

      const participant = await prisma.participant.findUnique({
        where: {
          userId_pollId: {
            pollId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return reply
          .status(404)
          .send({ message: "You're not allowed to create a guess inside this poll." });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return reply.status(409).send({ message: 'You already created a guess for this game.' });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(404).send({ message: 'This game does not exist.' });
      }

      if (game.date < new Date()) {
        return reply.status(409).send({ message: 'This game already happened.' });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return reply.status(201).send();
    },
  );
};
