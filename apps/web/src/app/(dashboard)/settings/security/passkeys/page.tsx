import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getServerComponentFlag } from '@documenso/lib/server-only/feature-flags/get-server-component-feature-flag';

import { SettingsHeader } from '~/components/(dashboard)/settings/layout/header';

import { CreatePasskeyDialog } from './create-passkey-dialog';
import { UserPasskeysDataTable } from './user-passkeys-data-table';

export const metadata: Metadata = {
  title: 'მართეთ საიდუმლო გასაღებები',
  // title: 'Manage passkeys',
};

export default async function SettingsManagePasskeysPage() {
  const isPasskeyEnabled = await getServerComponentFlag('app_passkey');

  if (!isPasskeyEnabled) {
    redirect('/settings/security');
  }

  return (
    <div>
      <SettingsHeader
        title="საიდუმლო გასაღებები (Passkeys)"
        subtitle="მართეთ თქვენი საიდუმლო გასაღებები."
        hideDivider={true}
      >
        <CreatePasskeyDialog />
      </SettingsHeader>

      <div className="mt-4">
        <UserPasskeysDataTable />
      </div>
    </div>
  );
}
