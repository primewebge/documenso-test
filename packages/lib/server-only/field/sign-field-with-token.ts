'use server';

import { DateTime } from 'luxon';
import { match } from 'ts-pattern';

import { prisma } from '@documenso/prisma';
import { DocumentStatus, FieldType, SigningStatus } from '@documenso/prisma/client';

import { DEFAULT_DOCUMENT_DATE_FORMAT } from '../../constants/date-formats';
import { DEFAULT_DOCUMENT_TIME_ZONE } from '../../constants/time-zones';
import { AppError, AppErrorCode } from '../../errors/app-error';
import { DOCUMENT_AUDIT_LOG_TYPE } from '../../types/document-audit-logs';
import type { TRecipientActionAuth } from '../../types/document-auth';
import type { RequestMetadata } from '../../universal/extract-request-metadata';
import { createDocumentAuditLogData } from '../../utils/document-audit-logs';
import { extractDocumentAuthMethods } from '../../utils/document-auth';
import { isRecipientAuthorized } from '../document/is-recipient-authorized';

export type SignFieldWithTokenOptions = {
  token: string;
  fieldId: number;
  value: string;
  isBase64?: boolean;
  userId?: number;
  authOptions?: TRecipientActionAuth;
  requestMetadata?: RequestMetadata;
};

export const signFieldWithToken = async ({
  token,
  fieldId,
  value,
  isBase64,
  userId,
  authOptions,
  requestMetadata,
}: SignFieldWithTokenOptions) => {
  const field = await prisma.field.findFirstOrThrow({
    where: {
      id: fieldId,
      Recipient: {
        token,
      },
    },
    include: {
      Document: true,
      Recipient: true,
    },
  });

  const { Document: document, Recipient: recipient } = field;

  if (!document) {
    throw new Error(`დოკუმენტი ველისთვის - ${field.id} არ მოიძებნა`);
  }

  if (!recipient) {
    throw new Error(`მიმღები ველისთვის - ${field.id} არ მოიძებნა`);
  }

  if (document.deletedAt) {
    throw new Error(`დოკუმენტი ${document.id} წაშლილია`);
  }

  if (document.status !== DocumentStatus.PENDING) {
    throw new Error(`დოკუმენტი ${document.id} ხელმოწერის მოლოდინში უნდა იყოს`);
  }

  if (recipient?.signingStatus === SigningStatus.SIGNED) {
    throw new Error(`მიმღებმა ${recipient.id} ხელი უკვე მოაწერა`);
  }

  if (field.inserted) {
    throw new Error(`ველი ${fieldId} უკვე ჩასმულია`);
  }

  // Unreachable code based on the above query but we need to satisfy TypeScript
  if (field.recipientId === null) {
    throw new Error(`ველს - ${fieldId} არ აქვს მიმღების ID`);
  }

  let { derivedRecipientActionAuth } = extractDocumentAuthMethods({
    documentAuth: document.authOptions,
    recipientAuth: recipient.authOptions,
  });

  // Override all non-signature fields to not require any auth.
  if (field.type !== FieldType.SIGNATURE) {
    derivedRecipientActionAuth = null;
  }

  let isValid = true;

  // Only require auth on signature fields for now.
  if (field.type === FieldType.SIGNATURE) {
    isValid = await isRecipientAuthorized({
      type: 'ACTION',
      document: document,
      recipient: recipient,
      userId,
      authOptions,
    });
  }

  if (!isValid) {
    throw new AppError(AppErrorCode.UNAUTHORIZED, 'ავთენტიფიკაციის არასწორი მნიშვნელობები');
    // throw new AppError(AppErrorCode.UNAUTHORIZED, 'Invalid authentication values');
  }

  const documentMeta = await prisma.documentMeta.findFirst({
    where: {
      documentId: document.id,
    },
  });

  const isSignatureField =
    field.type === FieldType.SIGNATURE || field.type === FieldType.FREE_SIGNATURE;

  let customText = !isSignatureField ? value : undefined;

  const signatureImageAsBase64 = isSignatureField && isBase64 ? value : undefined;
  const typedSignature = isSignatureField && !isBase64 ? value : undefined;

  if (field.type === FieldType.DATE) {
    customText = DateTime.now()
      .setZone(documentMeta?.timezone ?? DEFAULT_DOCUMENT_TIME_ZONE)
      .toFormat(documentMeta?.dateFormat ?? DEFAULT_DOCUMENT_DATE_FORMAT);
  }

  if (isSignatureField && !signatureImageAsBase64 && !typedSignature) {
    throw new Error('ხელმოწერის ველს უნდა ჰქონდეს ხელმოწერა');
  }

  return await prisma.$transaction(async (tx) => {
    const updatedField = await tx.field.update({
      where: {
        id: field.id,
      },
      data: {
        customText,
        inserted: true,
      },
    });

    if (isSignatureField) {
      if (!field.recipientId) {
        throw new Error('ველს არ აქვს მიმღების ID');
      }

      const signature = await tx.signature.upsert({
        where: {
          fieldId: field.id,
        },
        create: {
          fieldId: field.id,
          recipientId: field.recipientId,
          signatureImageAsBase64: signatureImageAsBase64,
          typedSignature: typedSignature,
        },
        update: {
          signatureImageAsBase64: signatureImageAsBase64,
          typedSignature: typedSignature,
        },
      });

      // Dirty but I don't want to deal with type information
      Object.assign(updatedField, {
        Signature: signature,
      });
    }

    await tx.documentAuditLog.create({
      data: createDocumentAuditLogData({
        type: DOCUMENT_AUDIT_LOG_TYPE.DOCUMENT_FIELD_INSERTED,
        documentId: document.id,
        user: {
          email: recipient.email,
          name: recipient.name,
        },
        requestMetadata,
        data: {
          recipientEmail: recipient.email,
          recipientId: recipient.id,
          recipientName: recipient.name,
          recipientRole: recipient.role,
          fieldId: updatedField.secondaryId,
          field: match(updatedField.type)
            .with(FieldType.SIGNATURE, FieldType.FREE_SIGNATURE, (type) => ({
              type,
              data: signatureImageAsBase64 || typedSignature || '',
            }))
            .with(FieldType.DATE, FieldType.EMAIL, FieldType.NAME, FieldType.TEXT, (type) => ({
              type,
              data: updatedField.customText,
            }))
            .exhaustive(),
          fieldSecurity: derivedRecipientActionAuth
            ? {
                type: derivedRecipientActionAuth,
              }
            : undefined,
        },
      }),
    });

    return updatedField;
  });
};
