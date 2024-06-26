'use client';

import { useRouter } from 'next/navigation';

import { Edit, Loader, Mail, MoreHorizontal, X } from 'lucide-react';

import type { getTeamByUrl } from '@documenso/lib/server-only/team/get-team';
import { trpc } from '@documenso/trpc/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';
import { useToast } from '@documenso/ui/primitives/use-toast';

import { UpdateTeamEmailDialog } from '~/components/(teams)/dialogs/update-team-email-dialog';

export type TeamsSettingsPageProps = {
  team: Awaited<ReturnType<typeof getTeamByUrl>>;
};

export const TeamEmailDropdown = ({ team }: TeamsSettingsPageProps) => {
  const router = useRouter();

  const { toast } = useToast();

  const { mutateAsync: resendEmailVerification, isLoading: isResendingEmailVerification } =
    trpc.team.resendTeamEmailVerification.useMutation({
      onSuccess: () => {
        toast({
          title: 'მეილი გამოგზავნილია',
          description: 'სავერიფიკაციო მეილი თავიდან გამოიგზავნა.',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'დაფიქსირდა ხარვეზი',
          variant: 'destructive',
          duration: 10000,
          description:
            'სავერიფიკაციო მეილის ხელახლა გაგზავნა ამჯერად ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.',
        });
      },
    });

  const { mutateAsync: deleteTeamEmail, isLoading: isDeletingTeamEmail } =
    trpc.team.deleteTeamEmail.useMutation({
      onSuccess: () => {
        toast({
          title: 'ელ.ფოსტა წაშლილია',
          description: 'გუნდის ელ.ფოსტა წარმატებით წაიშალა!',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'დაფიქსირდა ხარვეზი',
          variant: 'destructive',
          duration: 10000,
          description: 'გუნდის ელ.ფოსტის წაშლა ამჯერად ვერ მოხერხდა. გთხოვთ კიდევ სცადეთ.',
        });
      },
    });

  const { mutateAsync: deleteTeamEmailVerification, isLoading: isDeletingTeamEmailVerification } =
    trpc.team.deleteTeamEmailVerification.useMutation({
      onSuccess: () => {
        toast({
          title: 'ელ.ფოსტის ვერიფიკაცია მოშორებულია',
          description: 'ელ.ფოსტის ვერიფიკაცია წარმატებით წაიშალა!',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'დაფიქსირდა ხარვეზი',
          variant: 'destructive',
          duration: 10000,
          description: 'ამჯერად ელ.ფოსტის ვერიფიკაციის წაშლა ვერ მოხერხდა. გთხოვთ კიდევ სცადეთ.',
        });
      },
    });

  const onRemove = async () => {
    if (team.teamEmail) {
      await deleteTeamEmail({ teamId: team.id });
    }

    if (team.emailVerification) {
      await deleteTeamEmailVerification({ teamId: team.id });
    }

    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="text-muted-foreground h-5 w-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52" align="start" forceMount>
        {!team.teamEmail && team.emailVerification && (
          <DropdownMenuItem
            disabled={isResendingEmailVerification}
            onClick={(e) => {
              e.preventDefault();
              void resendEmailVerification({ teamId: team.id });
            }}
          >
            {isResendingEmailVerification ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            ვერიფიკაციის ხელახლა გაგზავნა
          </DropdownMenuItem>
        )}

        {team.teamEmail && (
          <UpdateTeamEmailDialog
            teamEmail={team.teamEmail}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                რედაქტირება
              </DropdownMenuItem>
            }
          />
        )}

        <DropdownMenuItem
          disabled={isDeletingTeamEmail || isDeletingTeamEmailVerification}
          onClick={async () => onRemove()}
        >
          <X className="mr-2 h-4 w-4" />
          {/* Remove */}
          წაშლა
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
