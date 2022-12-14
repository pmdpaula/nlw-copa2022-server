import { FastifyInstance } from 'fastify';
import z from 'zod';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export const gameRoutes = async (fastify: FastifyInstance) => {
  // List games from a poll
  fastify.get(
    '/polls/:id/games',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getPollParams = z.object({
        id: z.string(),
      });

      const { id } = getPollParams.parse(request.params);

      const games = await prisma.game.findMany({
        orderBy: {
          date: 'desc',
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId: request.user.sub,
                pollId: id,
              },
            },
          },
        },
      });

      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        games: games.map((game: { guesses: string | any[] }) => {
          return {
            ...game,
            guess: game.guesses.length > 0 ? game.guesses[0] : null,
            guesses: undefined,
          };
        }),
      };
    },
  );
};
