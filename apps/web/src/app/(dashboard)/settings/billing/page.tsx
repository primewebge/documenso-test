import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { match } from 'ts-pattern';

import { getStripeCustomerByUser } from '@documenso/ee/server-only/stripe/get-customer';
import { getPricesByInterval } from '@documenso/ee/server-only/stripe/get-prices-by-interval';
import { getPrimaryAccountPlanPrices } from '@documenso/ee/server-only/stripe/get-primary-account-plan-prices';
import { getProductByPriceId } from '@documenso/ee/server-only/stripe/get-product-by-price-id';
import { STRIPE_PLAN_TYPE } from '@documenso/lib/constants/billing';
import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-component-session';
import { getServerComponentFlag } from '@documenso/lib/server-only/feature-flags/get-server-component-feature-flag';
import { type Stripe } from '@documenso/lib/server-only/stripe';
import { getSubscriptionsByUserId } from '@documenso/lib/server-only/subscription/get-subscriptions-by-user-id';
import { SubscriptionStatus } from '@documenso/prisma/client';

import { LocaleDate } from '~/components/formatter/locale-date';

import { BillingPlans } from './billing-plans';
import { BillingPortalButton } from './billing-portal-button';

export const metadata: Metadata = {
  title: 'გადახდები',
  // title: 'Billing',
};

export default async function BillingSettingsPage() {
  let { user } = await getRequiredServerComponentSession();

  const isBillingEnabled = await getServerComponentFlag('app_billing');

  // Redirect if subscriptions are not enabled.
  if (!isBillingEnabled) {
    redirect('/settings/profile');
  }

  if (!user.customerId) {
    user = await getStripeCustomerByUser(user).then((result) => result.user);
  }

  const [subscriptions, prices, primaryAccountPlanPrices] = await Promise.all([
    getSubscriptionsByUserId({ userId: user.id }),
    getPricesByInterval({ plan: STRIPE_PLAN_TYPE.COMMUNITY }),
    getPrimaryAccountPlanPrices(),
  ]);

  const primaryAccountPlanPriceIds = primaryAccountPlanPrices.map(({ id }) => id);

  let subscriptionProduct: Stripe.Product | null = null;

  const primaryAccountPlanSubscriptions = subscriptions.filter(({ priceId }) =>
    primaryAccountPlanPriceIds.includes(priceId),
  );

  const subscription =
    primaryAccountPlanSubscriptions.find(({ status }) => status === SubscriptionStatus.ACTIVE) ??
    primaryAccountPlanSubscriptions[0];

  if (subscription?.priceId) {
    subscriptionProduct = await getProductByPriceId({ priceId: subscription.priceId }).catch(
      () => null,
    );
  }

  const isMissingOrInactiveOrFreePlan =
    !subscription || subscription.status === SubscriptionStatus.INACTIVE;

  return (
    <div>
      <h3 className="text-2xl font-semibold">პაკეტები</h3>

      <div className="text-muted-foreground mt-2 text-sm">
        {isMissingOrInactiveOrFreePlan && (
          <p>
            თქვენ ამჟამად გაქვთ<span className="font-semibold">უფასო პაკეტი</span>.
          </p>
        )}

        {!isMissingOrInactiveOrFreePlan &&
          match(subscription.status)
            .with('ACTIVE', () => (
              <p>
                {subscriptionProduct ? (
                  <span>
                    თქვენ ამჟამად გაქვთ{' '}
                    <span className="font-semibold">{subscriptionProduct.name}</span>
                  </span>
                ) : (
                  <span>თქვენი პაკეტი გააქტიურებულია</span>
                )}

                {subscription.periodEnd && (
                  <span>
                    {' '}
                    გააქტიურებულია{' '}
                    {subscription.cancelAtPeriodEnd ? (
                      <span>
                        მთავრდება{' '}
                        <LocaleDate className="font-semibold" date={subscription.periodEnd} />.
                      </span>
                    ) : (
                      <span>
                        ავტომატური განახლება{' '}
                        <LocaleDate className="font-semibold" date={subscription.periodEnd} />.
                      </span>
                    )}
                  </span>
                )}
              </p>
            ))
            .with('PAST_DUE', () => (
              <p>
                თქვენს მიმდინარე პაკეტს ვადა გაუვიდა. სერვისების გამოსაყენებლად, გთხოვთ, განაახლოთ
                პაკეტი.
              </p>
            ))
            .otherwise(() => null)}
      </div>

      <hr className="my-4" />

      {isMissingOrInactiveOrFreePlan ? <BillingPlans prices={prices} /> : <BillingPortalButton />}
    </div>
  );
}
