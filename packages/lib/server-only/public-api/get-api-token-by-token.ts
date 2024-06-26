import { prisma } from '@documenso/prisma';

import { hashString } from '../auth/hash';

export const getApiTokenByToken = async ({ token }: { token: string }) => {
  const hashedToken = hashString(token);

  const apiToken = await prisma.apiToken.findFirst({
    where: {
      token: hashedToken,
    },
    include: {
      team: true,
      user: true,
    },
  });

  if (!apiToken) {
    throw new Error('არასწორი ტოკენი');
  }

  if (apiToken.expires && apiToken.expires < new Date()) {
    throw new Error('ვადა გასული ტოკენი');
  }

  if (apiToken.team) {
    apiToken.user = await prisma.user.findFirst({
      where: {
        id: apiToken.team.ownerUserId,
      },
    });
  }

  const { user } = apiToken;

  if (!user) {
    throw new Error('არასწორი ტოკენი');
  }

  return { ...apiToken, user };
};
