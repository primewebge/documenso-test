'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TRPCClientError } from '@documenso/trpc/client';
import { trpc } from '@documenso/trpc/react';
import { ZPasswordSchema } from '@documenso/trpc/server/auth-router/schema';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { PasswordInput } from '@documenso/ui/primitives/password-input';
import { useToast } from '@documenso/ui/primitives/use-toast';

export const ZResetPasswordFormSchema = z
  .object({
    password: ZPasswordSchema,
    repeatedPassword: ZPasswordSchema,
  })
  .refine((data) => data.password === data.repeatedPassword, {
    path: ['repeatedPassword'],
    message: 'პაროლები ერთმანეთს არ ემთხვევა',
  });

export type TResetPasswordFormSchema = z.infer<typeof ZResetPasswordFormSchema>;

export type ResetPasswordFormProps = {
  className?: string;
  token: string;
};

export const ResetPasswordForm = ({ className, token }: ResetPasswordFormProps) => {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<TResetPasswordFormSchema>({
    values: {
      password: '',
      repeatedPassword: '',
    },
    resolver: zodResolver(ZResetPasswordFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync: resetPassword } = trpc.profile.resetPassword.useMutation();

  const onFormSubmit = async ({ password }: Omit<TResetPasswordFormSchema, 'repeatedPassword'>) => {
    try {
      await resetPassword({
        password,
        token,
      });

      form.reset();

      toast({
        title: 'პაროლი განახლებულია',
        description: 'თქვენი პაროლი წარმატებით განახლდა!',
        duration: 5000,
      });

      router.push('/signin');
    } catch (err) {
      if (err instanceof TRPCClientError && err.data?.code === 'BAD_REQUEST') {
        toast({
          title: 'დაფიქსირდა ხარვეზი',
          description: err.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'დაფიქსირდა ხარვეზი',
          variant: 'destructive',
          description:
            'პაროლის აღდგენისას დაფიქსირდა ხარვეზი. გთხოვთ თავიდან სცადოთ ან დაგვიკავშირდეთ.',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex w-full flex-col gap-y-4', className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <fieldset className="flex w-full flex-col gap-y-4" disabled={isSubmitting}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>პაროლი</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeatedPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>გაიმეორეთ პაროლი</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <Button type="submit" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'პაროლის აღდგენა...' : 'პაროლის აღდგენა'}
        </Button>
      </form>
    </Form>
  );
};
