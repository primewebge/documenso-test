import { createElement } from 'react';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { DocumentInviteEmailTemplate } from '@documenso/email/templates/document-invite';
import { FROM_ADDRESS, FROM_NAME } from '@documenso/lib/constants/email';
import {
  RECIPIENT_ROLES_DESCRIPTION,
  RECIPIENT_ROLE_TO_EMAIL_TYPE,
} from '@documenso/lib/constants/recipient-roles';
import { DOCUMENT_AUDIT_LOG_TYPE } from '@documenso/lib/types/document-audit-logs';
import type { RequestMetadata } from '@documenso/lib/universal/extract-request-metadata';
import { createDocumentAuditLogData } from '@documenso/lib/utils/document-audit-logs';
import { renderCustomEmailTemplate } from '@documenso/lib/utils/render-custom-email-template';
import { prisma } from '@documenso/prisma';
import { DocumentStatus, RecipientRole, SigningStatus } from '@documenso/prisma/client';
import type { Prisma } from '@documenso/prisma/client';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import { getDocumentWhereInput } from './get-document-by-id';

export type ResendDocumentOptions = {
  documentId: number;
  userId: number;
  recipients: number[];
  teamId?: number;
  requestMetadata: RequestMetadata;
};

export const resendDocument = async ({
  documentId,
  userId,
  recipients,
  teamId,
  requestMetadata,
}: ResendDocumentOptions) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const documentWhereInput: Prisma.DocumentWhereUniqueInput = await getDocumentWhereInput({
    documentId,
    userId,
    teamId,
  });

  const document = await prisma.document.findUnique({
    where: documentWhereInput,
    include: {
      Recipient: {
        where: {
          id: {
            in: recipients,
          },
          signingStatus: SigningStatus.NOT_SIGNED,
        },
      },
      documentMeta: true,
    },
  });

  const customEmail = document?.documentMeta;

  if (!document) {
    throw new Error('დოკუმენტი არ მოიძებნა');
  }

  if (document.Recipient.length === 0) {
    throw new Error('დოკუმენტს მიმღებები არ ჰყავს');
  }

  if (document.status === DocumentStatus.DRAFT) {
    throw new Error('დრაფტი დოკუმენტის გაგზავნა შეუძლებელია');
  }

  if (document.status === DocumentStatus.COMPLETED) {
    throw new Error('ხელმოწერილი დოკუმენტის გაგზავნა შეუძლებელია');
  }

  await Promise.all(
    document.Recipient.map(async (recipient) => {
      if (recipient.role === RecipientRole.CC) {
        return;
      }

      const recipientEmailType = RECIPIENT_ROLE_TO_EMAIL_TYPE[recipient.role];

      const { email, name } = recipient;
      const selfSigner = email === user.email;

      const selfSignerCustomEmail = `თქვენ შექმენით დოკუმენტი ${`"${document.title}"`}, რომელიც საჭიროებს, რომ ${
        RECIPIENT_ROLES_DESCRIPTION[recipient.role].actionVerb
      }`;

      const customEmailTemplate = {
        'signer.name': name,
        'signer.email': email,
        'document.name': document.title,
      };

      const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';
      const signDocumentLink = `${NEXT_PUBLIC_WEBAPP_URL()}/sign/${recipient.token}`;

      const template = createElement(DocumentInviteEmailTemplate, {
        documentName: document.title,
        inviterName: user.name || undefined,
        inviterEmail: user.email,
        assetBaseUrl,
        signDocumentLink,
        customBody: renderCustomEmailTemplate(
          selfSigner && !customEmail?.message ? selfSignerCustomEmail : customEmail?.message || '',
          customEmailTemplate,
        ),
        role: recipient.role,
        selfSigner,
      });

      const { actionVerb } = RECIPIENT_ROLES_DESCRIPTION[recipient.role];

      // const emailSubject = selfSigner
      //   ? `შეხსენება: გთხოვთ ${actionVerb} თქვენს დოკუმენტს`
      //   : `შეხსენება: გთხოვთ ${actionVerb} ამ დოკუმენტს`;

      const emailSubject = `
      ${actionVerb === 'ხელი მოაწეროთ' ? `შეხსენება: გთხოვთ ${actionVerb} ამ დოკუმენტს` : ''}
      ${actionVerb === 'დაამტკიცოთ' ? `შეხსენება: გთხოვთ ${actionVerb} ეს დოკუმენტი` : ''}
      ${actionVerb === 'იხილოთ' ? `შეხსენება: გთხოვთ ${actionVerb} ეს დოკუმენტი` : ''}
      ${actionVerb === 'ასლი მიიღოთ' ? `შეხსენება: გთხოვთ ამ დოკუმენტის ${actionVerb}` : ''}
    `;

      await prisma.$transaction(
        async (tx) => {
          await mailer.sendMail({
            to: {
              address: email,
              name,
            },
            from: {
              name: FROM_NAME,
              address: FROM_ADDRESS,
            },
            subject: customEmail?.subject
              ? renderCustomEmailTemplate(`შეხსენება: ${customEmail.subject}`, customEmailTemplate)
              : emailSubject,
            html: render(template),
            text: render(template, { plainText: true }),
          });

          await tx.documentAuditLog.create({
            data: createDocumentAuditLogData({
              type: DOCUMENT_AUDIT_LOG_TYPE.EMAIL_SENT,
              documentId: document.id,
              user,
              requestMetadata,
              data: {
                emailType: recipientEmailType,
                recipientEmail: recipient.email,
                recipientName: recipient.name,
                recipientRole: recipient.role,
                recipientId: recipient.id,
                isResending: true,
              },
            }),
          });
        },
        { timeout: 30_000 },
      );
    }),
  );
};
