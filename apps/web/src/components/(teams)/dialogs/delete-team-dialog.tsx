'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppError } from '@documenso/lib/errors/app-error';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import type { Toast } from '@documenso/ui/primitives/use-toast';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type DeleteTeamDialogProps = {
  teamId: number;
  teamName: string;
  trigger?: React.ReactNode;
};

export const DeleteTeamDialog = ({ trigger, teamId, teamName }: DeleteTeamDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const deleteMessage = `წაშალეთ ${teamName}`;
  // const deleteMessage = `delete ${teamName}`;

  const ZDeleteTeamFormSchema = z.object({
    teamName: z.literal(deleteMessage, {
      errorMap: () => ({ message: `გასაგრძელებლად უნდა ჩაწეროთ „${deleteMessage}“.` }),
    }),
  });

  const form = useForm({
    resolver: zodResolver(ZDeleteTeamFormSchema),
    defaultValues: {
      teamName: '',
    },
  });

  const { mutateAsync: deleteTeam } = trpc.team.deleteTeam.useMutation();

  const onFormSubmit = async () => {
    try {
      await deleteTeam({ teamId });

      toast({
        title: 'გუნდი წაშლილია',
        description: 'თქვენი გუნდი წარმატებით წაიშალა!',
        duration: 5000,
      });

      setOpen(false);

      router.push('/settings/teams');
    } catch (err) {
      const error = AppError.parseError(err);

      let toastError: Toast = {
        title: 'დაფიქსირდა ხარვეზი',
        variant: 'destructive',
        duration: 10000,
        description: 'გუნდის წაშლისას დაფიქსირდა ხარვეზი. გთხოვთ თავიდან სცადოთ.',
      };

      if (error.code === 'resource_missing') {
        toastError = {
          title: 'გუნდის წაშლა ვერ მოხერხდა',
          variant: 'destructive',
          duration: 15000,
          description: 'გუნდის ბილინგის განახლებისას დაფიქსირდა ხარვეზი. გთხოვთ დაგვიკავშირდეთ.',
        };
      }

      toast(toastError);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={(value) => !form.formState.isSubmitting && setOpen(value)}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="destructive">წაშლა</Button>}
      </DialogTrigger>

      <DialogContent position="center">
        <DialogHeader>
          <DialogTitle>წაშალეთ გუნდი</DialogTitle>

          <DialogDescription className="mt-4">
            ნამდვილად გსურთ წაშლა? ეს ქმედება შეუქცევადია.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <fieldset
              className="flex h-full flex-col space-y-4"
              disabled={form.formState.isSubmitting}
            >
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      დადასტურებისთვის ჩაწერეთ{' '}
                      <span className="text-destructive">{deleteMessage}</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  დახურვა
                </Button>

                <Button type="submit" variant="destructive" loading={form.formState.isSubmitting}>
                  წაშლა
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
