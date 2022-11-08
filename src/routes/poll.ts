import { FastifyInstance } from 'fastify';
import ShortUniqueId from 'short-unique-id';
import z from 'zod';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export const pollRoutes = async (fastify: FastifyInstance) => {
  // Count the number of polls
  fastify.get('/polls/count', async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  // Join a poll
  fastify.post('/polls', async (request) => {
    const createPollBody = z.object({
      title: z.string(),
    });

    const { title } = createPollBody.parse(request.body);

    const generateId = new ShortUniqueId({ length: 6 });
    const code = String(generateId()).toUpperCase();

    try {
      await request.jwtVerify();

      await prisma.poll.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          // to create a relation between the poll and the user (prisma)
          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      });
    } catch {
      await prisma.poll.create({
        data: {
          title,
          code,
        },
      });
    }

    return { code };
    // return reply.status(201).send({ code });
  });

  fastify.post(
    '/polls/join',
    {
      // route only accessible if authenticated
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const joinPollBody = await z.object({
        code: z.string(),
      });

      const { code } = joinPollBody.parse(request.body);

      const poll = await prisma.poll.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      });

      // if poll doesn't exist
      if (!poll) {
        return reply.status(404).send({ message: 'Poll not found' });
      }

      // if user is already in the poll
      if (poll.participants.length > 0) {
        return reply.status(400).send({ message: 'Already joined this poll.' });
      }

      // solution for web version without authentication.
      // TODO: implement authentication for web version.
      if (!poll.ownerId) {
        await prisma.poll.update({
          where: {
            id: poll.id,
          },
          data: {
            ownerId: request.user.sub,
          },
        });
      }

      // if user is not in the poll, create the relation between the poll and the user
      await prisma.participant.create({
        data: {
          userId: request.user.sub,
          pollId: poll.id,
        },
      });

      return reply.status(201).send();
    },
  );

  // Get all polls where the participant list includes id of the logged user
  fastify.get(
    '/polls',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const polls = await prisma.poll.findMany({
        where: {
          participants: {
            some: {
              userId: request.user.sub,
            },
          },
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },

          participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { polls };
    },
  );

  fastify.get(
    '/polls/:id',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getPollParams = z.object({
        id: z.string(),
      });

      const { id } = getPollParams.parse(request.params);

      const poll = await prisma.poll.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },

          participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { poll };
    },
  );
};
