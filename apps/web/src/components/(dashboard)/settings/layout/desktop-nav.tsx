'use client';

import type { HTMLAttributes } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Braces, CreditCard, Lock, User, Users, Webhook } from 'lucide-react';

import { useFeatureFlags } from '@documenso/lib/client-only/providers/feature-flag';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';

export type DesktopNavProps = HTMLAttributes<HTMLDivElement>;

export const DesktopNav = ({ className, ...props }: DesktopNavProps) => {
  const pathname = usePathname();

  const { getFlag } = useFeatureFlags();

  const isBillingEnabled = getFlag('app_billing');

  return (
    <div className={cn('flex flex-col gap-y-2', className)} {...props}>
      <Link href="/settings/profile">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/profile') && 'bg-secondary',
          )}
        >
          <User className="mr-2 h-5 w-5" />
          პროფილი
        </Button>
      </Link>

      <Link href="/settings/teams">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/teams') && 'bg-secondary',
          )}
        >
          <Users className="mr-2 h-5 w-5" />
          გუნდები
        </Button>
      </Link>

      <Link href="/settings/security">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/security') && 'bg-secondary',
          )}
        >
          <Lock className="mr-2 h-5 w-5" />
          უსაფრთხოება
        </Button>
      </Link>

      <Link href="/settings/tokens">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/tokens') && 'bg-secondary',
          )}
        >
          <Braces className="mr-2 h-5 w-5" />
          API ტოკენები
        </Button>
      </Link>

      <Link href="/settings/webhooks">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/webhooks') && 'bg-secondary',
          )}
        >
          <Webhook className="mr-2 h-5 w-5" />
          ვებჰუკები
        </Button>
      </Link>

      {isBillingEnabled && (
        <Link href="/settings/billing">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              pathname?.startsWith('/settings/billing') && 'bg-secondary',
            )}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            გადახდები
          </Button>
        </Link>
      )}
    </div>
  );
};
