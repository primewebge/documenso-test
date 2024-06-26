'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { User } from '@documenso/prisma/client';
import { TRPCClientError } from '@documenso/trpc/client';
import { trpc } from '@documenso/trpc/react';
import { ZCurrentPasswordSchema, ZPasswordSchema } from '@documenso/trpc/server/auth-router/schema';
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

export const ZPasswordFormSchema = z
  .object({
    currentPassword: ZCurrentPasswordSchema,
    password: ZPasswordSchema,
    repeatedPassword: ZPasswordSchema,
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: 'პაროლები ერთმანეთს არ ემთხვევა',
    path: ['repeatedPassword'],
  });

export type TPasswordFormSchema = z.infer<typeof ZPasswordFormSchema>;

export type PasswordFormProps = {
  className?: string;
  user: User;
};

export const PasswordForm = ({ className }: PasswordFormProps) => {
  const { toast } = useToast();

  const form = useForm<TPasswordFormSchema>({
    values: {
      currentPassword: '',
      password: '',
      repeatedPassword: '',
    },
    resolver: zodResolver(ZPasswordFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync: updatePassword } = trpc.profile.updatePassword.useMutation();

  const onFormSubmit = async ({ currentPassword, password }: TPasswordFormSchema) => {
    try {
      await updatePassword({
        currentPassword,
        password,
      });

      form.reset();

      toast({
        title: 'პაროლი განახლებულია',
        description: 'თქვენი პაროლი წარმატებით განახლდა.',
        duration: 5000,
      });
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
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>მოქმედი პაროლი</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ახალი პაროლი</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
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
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="ml-auto mt-4">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'პაროლი ნახლდება...' : 'განაახლეთ პაროლი'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
