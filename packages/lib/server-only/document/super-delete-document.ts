'use server';

import { createElement } from 'react';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import DocumentCancelTemplate from '@documenso/email/templates/document-cancel';
import { prisma } from '@documenso/prisma';
import { DocumentStatus } from '@documenso/prisma/client';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import { FROM_ADDRESS, FROM_NAME } from '../../constants/email';
import { DOCUMENT_AUDIT_LOG_TYPE } from '../../types/document-audit-logs';
import type { RequestMetadata } from '../../universal/extract-request-metadata';
import { createDocumentAuditLogData } from '../../utils/document-audit-logs';

export type SuperDeleteDocumentOptions = {
  id: number;
  requestMetadata?: RequestMetadata;
};

export const superDeleteDocument = async ({ id, requestMetadata }: SuperDeleteDocumentOptions) => {
  const document = await prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      Recipient: true,
      documentMeta: true,
      User: true,
    },
  });

  if (!document) {
    throw new Error('დოკუმენტი არ მოიძებნა');
  }

  const { status, User: user } = document;

  // if the document is pending, send cancellation emails to all recipients
  if (status === DocumentStatus.PENDING && document.Recipient.length > 0) {
    await Promise.all(
      document.Recipient.map(async (recipient) => {
        const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';
        const template = createElement(DocumentCancelTemplate, {
          documentName: document.title,
          inviterName: user.name || undefined,
          inviterEmail: user.email,
          assetBaseUrl,
        });

        await mailer.sendMail({
          to: {
            address: recipient.email,
            name: recipient.name,
          },
          from: {
            name: FROM_NAME,
            address: FROM_ADDRESS,
          },
          subject: 'დოკუმენტი გაუქმებულია',
          html: render(template),
          text: render(template, { plainText: true }),
        });
      }),
    );
  }

  // always hard delete if deleted from admin
  return await prisma.$transaction(async (tx) => {
    await tx.documentAuditLog.create({
      data: createDocumentAuditLogData({
        documentId: id,
        type: DOCUMENT_AUDIT_LOG_TYPE.DOCUMENT_DELETED,
        user,
        requestMetadata,
        data: {
          type: 'HARD',
        },
      }),
    });

    return await tx.document.delete({ where: { id } });
  });
};
