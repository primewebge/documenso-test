import { TRPCError } from '@trpc/server';

import { AppError } from '@documenso/lib/errors/app-error';
import { removeSignedFieldWithToken } from '@documenso/lib/server-only/field/remove-signed-field-with-token';
import { setFieldsForDocument } from '@documenso/lib/server-only/field/set-fields-for-document';
import { setFieldsForTemplate } from '@documenso/lib/server-only/field/set-fields-for-template';
import { signFieldWithToken } from '@documenso/lib/server-only/field/sign-field-with-token';
import { extractNextApiRequestMetadata } from '@documenso/lib/universal/extract-request-metadata';

import { authenticatedProcedure, procedure, router } from '../trpc';
import {
  ZAddFieldsMutationSchema,
  ZAddTemplateFieldsMutationSchema,
  ZRemovedSignedFieldWithTokenMutationSchema,
  ZSignFieldWithTokenMutationSchema,
} from './schema';

export const fieldRouter = router({
  addFields: authenticatedProcedure
    .input(ZAddFieldsMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { documentId, fields } = input;

        return await setFieldsForDocument({
          documentId,
          userId: ctx.user.id,
          fields: fields.map((field) => ({
            id: field.nativeId,
            signerEmail: field.signerEmail,
            type: field.type,
            pageNumber: field.pageNumber,
            pageX: field.pageX,
            pageY: field.pageY,
            pageWidth: field.pageWidth,
            pageHeight: field.pageHeight,
          })),
          requestMetadata: extractNextApiRequestMetadata(ctx.req),
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ჩვენ ვერ მოვახერხეთ ამ ველის დაყენება. გთხოვთ სცადოთ მოგვიანებით.',
          // message: 'We were unable to set this field. Please try again later.',
        });
      }
    }),

  addTemplateFields: authenticatedProcedure
    .input(ZAddTemplateFieldsMutationSchema)
    .mutation(async ({ input, ctx }) => {
      const { templateId, fields } = input;

      try {
        return await setFieldsForTemplate({
          userId: ctx.user.id,
          templateId,
          fields: fields.map((field) => ({
            id: field.nativeId,
            signerEmail: field.signerEmail,
            type: field.type,
            pageNumber: field.pageNumber,
            pageX: field.pageX,
            pageY: field.pageY,
            pageWidth: field.pageWidth,
            pageHeight: field.pageHeight,
          })),
        });
      } catch (err) {
        console.error(err);

        throw err;
      }
    }),

  signFieldWithToken: procedure
    .input(ZSignFieldWithTokenMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { token, fieldId, value, isBase64, authOptions } = input;

        return await signFieldWithToken({
          token,
          fieldId,
          value,
          isBase64,
          userId: ctx.user?.id,
          authOptions,
          requestMetadata: extractNextApiRequestMetadata(ctx.req),
        });
      } catch (err) {
        console.error(err);

        throw AppError.parseErrorToTRPCError(err);
      }
    }),

  removeSignedFieldWithToken: procedure
    .input(ZRemovedSignedFieldWithTokenMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { token, fieldId } = input;

        return await removeSignedFieldWithToken({
          token,
          fieldId,
          requestMetadata: extractNextApiRequestMetadata(ctx.req),
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ჩვენ ვერ მოვახერხეთ ამ ველიდან ხელმოწერის მოშორება. გთხოვთ სცადოთ მოგვიანებით.',
          // message: 'We were unable to remove the signature for this field. Please try again later.',
        });
      }
    }),
});
