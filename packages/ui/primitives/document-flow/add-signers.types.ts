import { z } from 'zod';

import { ZRecipientActionAuthTypesSchema } from '@documenso/lib/types/document-auth';

import { ZMapNegativeOneToUndefinedSchema } from './add-settings.types';
import { RecipientRole } from '.prisma/client';

export const ZAddSignersFormSchema = z
  .object({
    signers: z.array(
      z.object({
        formId: z.string().min(1),
        nativeId: z.number().optional(),
        email: z.string().email().min(1),
        name: z.string(),
        role: z.nativeEnum(RecipientRole),
        actionAuth: ZMapNegativeOneToUndefinedSchema.pipe(
          ZRecipientActionAuthTypesSchema.optional(),
        ),
      }),
    ),
  })
  .refine(
    (schema) => {
      const emails = schema.signers.map((signer) => signer.email.toLowerCase());

      return new Set(emails).size === emails.length;
    },
    // Dirty hack to handle errors when .root is populated for an array type
    { message: 'ხელმომწერებს უნდა ჰქონდეთ უნიკალური ელ.ფოსტები', path: ['signers__root'] },
    // { message: 'Signers must have unique emails', path: ['signers__root'] },
  );

export type TAddSignersFormSchema = z.infer<typeof ZAddSignersFormSchema>;
