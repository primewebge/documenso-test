import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppError } from '@documenso/lib/errors/app-error';
import { DocumentAuth, type TRecipientActionAuth } from '@documenso/lib/types/document-auth';
import { RecipientRole } from '@documenso/prisma/client';
import { trpc } from '@documenso/trpc/react';
import { Alert, AlertDescription, AlertTitle } from '@documenso/ui/primitives/alert';
import { Button } from '@documenso/ui/primitives/button';
import { DialogFooter } from '@documenso/ui/primitives/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@documenso/ui/primitives/select';

import { CreatePasskeyDialog } from '~/app/(dashboard)/settings/security/passkeys/create-passkey-dialog';

import { useRequiredDocumentAuthContext } from './document-auth-provider';

export type DocumentActionAuthPasskeyProps = {
  actionTarget?: 'FIELD' | 'DOCUMENT';
  actionVerb?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onReauthFormSubmit: (values?: TRecipientActionAuth) => Promise<void> | void;
};

const ZPasskeyAuthFormSchema = z.object({
  passkeyId: z.string(),
});

type TPasskeyAuthFormSchema = z.infer<typeof ZPasskeyAuthFormSchema>;

export const DocumentActionAuthPasskey = ({
  actionTarget = 'FIELD',
  actionVerb = 'ხელი მოაწეროთ',
  onReauthFormSubmit,
  open,
  onOpenChange,
}: DocumentActionAuthPasskeyProps) => {
  const {
    recipient,
    passkeyData,
    preferredPasskeyId,
    setPreferredPasskeyId,
    isCurrentlyAuthenticating,
    setIsCurrentlyAuthenticating,
    refetchPasskeys,
  } = useRequiredDocumentAuthContext();

  const form = useForm<TPasskeyAuthFormSchema>({
    resolver: zodResolver(ZPasskeyAuthFormSchema),
    defaultValues: {
      passkeyId: preferredPasskeyId || '',
    },
  });

  const { mutateAsync: createPasskeyAuthenticationOptions } =
    trpc.auth.createPasskeyAuthenticationOptions.useMutation();

  const [formErrorCode, setFormErrorCode] = useState<string | null>(null);

  const onFormSubmit = async ({ passkeyId }: TPasskeyAuthFormSchema) => {
    try {
      setPreferredPasskeyId(passkeyId);
      setIsCurrentlyAuthenticating(true);

      const { options, tokenReference } = await createPasskeyAuthenticationOptions({
        preferredPasskeyId: passkeyId,
      });

      const authenticationResponse = await startAuthentication(options);

      await onReauthFormSubmit({
        type: DocumentAuth.PASSKEY,
        authenticationResponse,
        tokenReference,
      });

      setIsCurrentlyAuthenticating(false);

      onOpenChange(false);
    } catch (err) {
      setIsCurrentlyAuthenticating(false);

      if (err.name === 'NotAllowedError') {
        return;
      }

      const error = AppError.parseError(err);
      setFormErrorCode(error.code);

      // Todo: Alert.
    }
  };

  useEffect(() => {
    form.reset({
      passkeyId: preferredPasskeyId || '',
    });

    setFormErrorCode(null);
  }, [open, form, preferredPasskeyId]);

  if (!browserSupportsWebAuthn()) {
    return (
      <div className="space-y-4">
        <Alert variant="warning">
          <AlertDescription>
            თქვენი ბრაუზერი ვერ აღიქვავს საიდუმლო გასაღებებს, რომელებიც საჭიროა იმისთვის, რომ{' '}
            {actionVerb.toLowerCase()} ამ {actionTarget.toLowerCase()}-ს.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            დახურვა
          </Button>
        </DialogFooter>
      </div>
    );
  }

  if (passkeyData.isInitialLoading || (passkeyData.isError && passkeyData.passkeys.length === 0)) {
    return (
      <div className="flex h-28 items-center justify-center">
        <Loader className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (passkeyData.isError) {
    return (
      <div className="h-28 space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            თქვენი საიდუმლო გასაღების ჩატვირთვისას დაფიქსირდა ხარვეზი.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            დახურვა
          </Button>

          <Button type="button" onClick={() => void refetchPasskeys()}>
            სცადეთ თავიდან
          </Button>
        </DialogFooter>
      </div>
    );
  }

  if (passkeyData.passkeys.length === 0) {
    return (
      <div className="space-y-4">
        <Alert variant="warning">
          <AlertDescription>
            {recipient.role === RecipientRole.VIEWER && actionTarget === 'DOCUMENT'
              ? 'თქვენ უნდა დააყენოთ საიდუმლო გასაღები (Passkey), რათა ეს დოკუმენტი ნანახად მოინიშნოს.'
              : `თქვენ უნდა დააყენოთ საიდუმლო გასაღები, რათა ${actionVerb} ამ ${actionTarget.toLowerCase()}-ს.`}
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            დახურვა
          </Button>

          <CreatePasskeyDialog
            onSuccess={async () => refetchPasskeys()}
            trigger={<Button>დაყენება</Button>}
            // trigger={<Button>Setup</Button>}
          />
        </DialogFooter>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)}>
        <fieldset disabled={isCurrentlyAuthenticating}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="passkeyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>საიდუმლო გასაღები</FormLabel>

                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background text-muted-foreground">
                        <SelectValue
                          data-testid="documentAccessSelectValue"
                          placeholder="აირჩიეთ საიდუმლო გასაღები"
                        />
                      </SelectTrigger>

                      <SelectContent position="popper">
                        {passkeyData.passkeys.map((passkey) => (
                          <SelectItem key={passkey.id} value={passkey.id}>
                            {passkey.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {formErrorCode && (
              <Alert variant="destructive">
                <AlertTitle>არა ავტორიზებული</AlertTitle>
                <AlertDescription>
                  ჩვენ ვერ შევძელით თქვენი დეტალების გადამოწმება. გთხოვთ სცადოთ ხელახლა ან
                  დაგვიკავშირდეთ.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                დახურვა
              </Button>

              <Button type="submit" loading={isCurrentlyAuthenticating}>
                ხელის მოწერა
              </Button>
            </DialogFooter>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};
