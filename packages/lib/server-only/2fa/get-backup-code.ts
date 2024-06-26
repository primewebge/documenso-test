import { z } from 'zod';

import type { User } from '@documenso/prisma/client';

import { DOCUMENSO_ENCRYPTION_KEY } from '../../constants/crypto';
import { symmetricDecrypt } from '../../universal/crypto';

interface GetBackupCodesOptions {
  user: User;
}

const ZBackupCodeSchema = z.array(z.string());

export const getBackupCodes = ({ user }: GetBackupCodesOptions) => {
  const key = DOCUMENSO_ENCRYPTION_KEY;

  if (!user.twoFactorEnabled) {
    throw new Error('მომხმარებელს არ აქვს 2FA ჩართული');
  }

  if (!user.twoFactorBackupCodes) {
    throw new Error('მომხმარებელს არ აქვს სარეზერვო კოდები');
  }

  const secret = Buffer.from(symmetricDecrypt({ key, data: user.twoFactorBackupCodes })).toString(
    'utf-8',
  );

  const data = JSON.parse(secret);

  const result = ZBackupCodeSchema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  return null;
};
