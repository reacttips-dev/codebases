import Naptime from 'bundles/naptimejs';

import CatalogSubscriptionsEnrollmentState from 'bundles/enroll/components/catalog-subs-hoc/CatalogSubscriptionsEnrollmentState';
import subscriptionPriceUtils from 'bundles/s12n-common/utils/subscriptionPriceUtils';
import BillingCycles from 'bundles/subscriptions/common/BillingCycleType';
import requestCountry from 'js/lib/requestCountry';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import user from 'js/lib/user';

type BillingCycleType = keyof typeof BillingCycles;

type Props = {
  catalogSubscriptionsEnrollmentState?: CatalogSubscriptionsEnrollmentState;
  billingCycleType?: BillingCycleType;
};

function withCatalogSubscriptionPrice(Component: any) {
  return Naptime.createContainer(({ catalogSubscriptionsEnrollmentState, billingCycleType }: Props) => {
    if (!user.isAuthenticatedUser()) {
      return {};
    }
    if (!catalogSubscriptionsEnrollmentState) {
      return {};
    }

    const productSkuId = billingCycleType
      ? subscriptionPriceUtils.getSubscriptionSkuId(
          catalogSubscriptionsEnrollmentState.availableCatalogSubscriptions,
          billingCycleType
        )
      : catalogSubscriptionsEnrollmentState.monthlyCatalogSubscriptionSkuId;

    return {
      catalogSubscriptionPrice: ProductPricesV3.getCatalogSubscriptionProductPrice(productSkuId, requestCountry.get()),
    };
  })(Component);
}

export default withCatalogSubscriptionPrice;
