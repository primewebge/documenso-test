import { initClient } from '@ts-rest/core';

import { ApiContractV1 } from '../contract';

const main = async () => {
  const client = initClient(ApiContractV1, {
    baseUrl: 'http://localhost:3000/api/v1',
    baseHeaders: {
      authorization: 'Bearer <my-token>',
    },
  });

  const { status, body } = await client.createDocument({
    body: {
      title: 'ჩემი დოკუმენტი',
      recipients: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'SIGNER',
        },
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'APPROVER',
        },
      ],
      meta: {
        subject: 'გთხოვთ ხელი მოაწეროთ ამ დოკუმენტს',
        message: 'გამარჯობა {signer.name}, გთხოვთ მოაწეროთ ხელი ამ დოკუმენტს: {document.name}',
      },
    },
  });

  if (status !== 200) {
    throw new Error('დოკუმენტის შემქნა ვერ მოხერხდა');
  }

  const { uploadUrl, documentId } = body;

  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: '<raw-binary-data>',
  });

  await client.sendDocument({
    params: {
      id: documentId.toString(),
    },
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
