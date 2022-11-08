import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const user = await prisma.user.create({
    data: {
      name: 'João das Coves',
      email: 'joaodascoves@gmail.com',
      avatarUrl: 'https://github.com/pmdpaula.png',
    },
  });

  const poll = await prisma.poll.create({
    data: {
      title: 'Poll 1',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  // const participant = await prisma.participant.create({
  //   data: {
  //     pollId: poll.id,
  //     userId: user.id,
  //   },
  // });

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.540Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    },
  });

  await prisma.game.create({
    data: {
      date: '2022-11-03T12:00:00.540Z',
      firstTeamCountryCode: 'IT',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          fisrtTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_pollId: {
                userId: user.id,
                pollId: poll.id,
              },
            },
          },
        },
      },
    },
  });
};

main();
