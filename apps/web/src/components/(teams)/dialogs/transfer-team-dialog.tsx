'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { IS_BILLING_ENABLED } from '@documenso/lib/constants/app';
import { trpc } from '@documenso/trpc/react';
import { Alert, AlertDescription } from '@documenso/ui/primitives/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@documenso/ui/primitives/select';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type TransferTeamDialogProps = {
  teamId: number;
  teamName: string;
  ownerUserId: number;
  trigger?: React.ReactNode;
};

export const TransferTeamDialog = ({
  trigger,
  teamId,
  teamName,
  ownerUserId,
}: TransferTeamDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const { mutateAsync: requestTeamOwnershipTransfer } =
    trpc.team.requestTeamOwnershipTransfer.useMutation();

  const {
    data,
    refetch: refetchTeamMembers,
    isLoading: loadingTeamMembers,
    isLoadingError: loadingTeamMembersError,
  } = trpc.team.getTeamMembers.useQuery({
    teamId,
  });

  const confirmTransferMessage = `transfer ${teamName}`;

  const ZTransferTeamFormSchema = z.object({
    teamName: z.literal(confirmTransferMessage, {
      errorMap: () => ({ message: `გაგრძელებისთვის ჩაწერეთ '${confirmTransferMessage}'` }),
    }),
    newOwnerUserId: z.string(),
    clearPaymentMethods: z.boolean(),
  });

  const form = useForm<z.infer<typeof ZTransferTeamFormSchema>>({
    resolver: zodResolver(ZTransferTeamFormSchema),
    defaultValues: {
      teamName: '',
      clearPaymentMethods: false,
    },
  });

  const onFormSubmit = async ({
    newOwnerUserId,
    clearPaymentMethods,
  }: z.infer<typeof ZTransferTeamFormSchema>) => {
    try {
      await requestTeamOwnershipTransfer({
        teamId,
        newOwnerUserId: Number.parseInt(newOwnerUserId),
        clearPaymentMethods,
      });

      router.refresh();

      toast({
        title: '',
        description: 'ამ გუნდის გადაცემის მოთხოვნით მეილი წარმატებით გაიგზავნა!',
        duration: 5000,
      });

      setOpen(false);
    } catch (err) {
      toast({
        title: 'დაფიქსირდა ხარვეზი',
        variant: 'destructive',
        duration: 10000,
        description: 'ამ გუნდის გადაცემის მოთხოვნისას დაფიქსირდა ხარვეზი. გთხოვთ თავიდან სცადოთ.',
      });
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    if (open && loadingTeamMembersError) {
      void refetchTeamMembers();
    }
  }, [open, loadingTeamMembersError, refetchTeamMembers]);

  const teamMembers = data
    ? data.filter((teamMember) => teamMember.userId !== ownerUserId)
    : undefined;

  return (
    <Dialog open={open} onOpenChange={(value) => !form.formState.isSubmitting && setOpen(value)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="bg-background">
            გუნდის გადაცემა
          </Button>
        )}
      </DialogTrigger>

      {teamMembers && teamMembers.length > 0 ? (
        <DialogContent position="center">
          <DialogHeader>
            <DialogTitle>გუნდის გადაცემა</DialogTitle>

            <DialogDescription className="mt-4">
              {/* Transfer ownership of this team to a selected team member. */}
              გადაეცით ამ გუნდის მფლობელობა მონიშნულ გუნდის წევრს.
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
                  name="newOwnerUserId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel required>ახალი გუნდის მფლობელები</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="text-muted-foreground">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent position="popper">
                            {teamMembers.map((teamMember) => (
                              <SelectItem
                                key={teamMember.userId}
                                value={teamMember.userId.toString()}
                              >
                                {teamMember.user.name} ({teamMember.user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        დადასტურებისთვის ჩაწერეთ{' '}
                        <span className="text-destructive">{confirmTransferMessage}</span>
                      </FormLabel>
                      <FormControl>
                        <Input className="bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Temporary removed.  */}
                {/* {IS_BILLING_ENABLED && (
                  <FormField
                    control={form.control}
                    name="clearPaymentMethods"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center">
                          <Checkbox
                            id="clearPaymentMethods"
                            className="h-5 w-5 rounded-full"
                            checkClassName="dark:text-white text-primary"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />

                          <label
                            className="text-muted-foreground ml-2 text-sm"
                            htmlFor="clearPaymentMethods"
                          >
                            Clear current payment methods
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                )} */}

                <Alert variant="neutral">
                  <AlertDescription>
                    <ul className="list-outside list-disc space-y-2 pl-4">
                      {IS_BILLING_ENABLED() && (
                        // Temporary removed.
                        // <li>
                        //   {form.getValues('clearPaymentMethods')
                        //     ? 'You will not be billed for any upcoming invoices'
                        //     : 'We will continue to bill current payment methods if required'}
                        // </li>

                        <li>
                          გადახდის ნებისმიერი მეთოდი, რომელიც გააქტიურებულია ამ გუნდის მიერ, დარჩება
                          ამ გუნდთან დაკავშირებული. გთხოვთ დაგვიკავშირდეთ, თუ გჭირდებათ ამ
                          ინფორმაციის განახლება.
                        </li>
                      )}
                      <li>
                        გუნდის მონიშნული წევრი მიიღებს მეილს, რომელსაც უნდა დაეთანხმოს გუნდის
                        გადაცემისთვის
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                    დახურვა
                  </Button>

                  <Button type="submit" variant="destructive" loading={form.formState.isSubmitting}>
                    გადაცემის მოთხოვნა
                  </Button>
                </DialogFooter>
              </fieldset>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent
          position="center"
          className="text-muted-foreground flex items-center justify-center py-16 text-sm"
        >
          {loadingTeamMembers ? (
            <Loader className="text-muted-foreground h-6 w-6 animate-spin" />
          ) : (
            <p className="text-center text-sm">
              {loadingTeamMembersError
                ? 'გუნდის წევრების ჩატვირთვისას დაფიქსირდა ხარვეზი. გთხოვთ თავიდან სცადოთ.'
                : 'თქვენ უნდა გყავდეთ გუნდის მინიმუმ ერთი სხვა წევრი გუნდის მფლობელობის გადასაცემად.'}
            </p>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};
