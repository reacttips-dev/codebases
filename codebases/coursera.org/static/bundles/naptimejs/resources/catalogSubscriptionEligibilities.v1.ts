import BillingCycleType from 'bundles/subscriptions/common/BillingCycleType';

import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import CatalogSubscriptionEligibilityType from 'bundles/payments/common/CatalogSubscriptionEligibilityType';
import NaptimeResource from './NaptimeResource';

type SubscriptionProduct = {
  productProperties: {
    billingCycle: string;
    status: string;
  };
  productItemId: string;
  productType: string;
};

class CatalogSubscriptionEligibilitiesV1 extends NaptimeResource {
  static RESOURCE_NAME = 'catalogSubscriptionEligibilities.v1';

  eligibility!: string;

  id!: string;

  availableSubscriptions!: Array<SubscriptionProduct>;

  @requireFields('availableSubscriptions')
  get monthlySubscriptionProduct(): SubscriptionProduct | undefined {
    return this.availableSubscriptions.find(
      (product) => product.productProperties.billingCycle === BillingCycleType.MONTHLY
    );
  }

  // used to match the name in enrollmentAvailableChoices.v1
  @requireFields('availableSubscriptions')
  get availableCatalogSubscriptions(): Array<SubscriptionProduct> {
    return this.availableSubscriptions;
  }

  @requireFields('eligibility')
  get isNotEligible(): boolean {
    return this.eligibility === CatalogSubscriptionEligibilityType.NOT_ELIGIBLE;
  }

  @requireFields('eligibility')
  get isSubscribed(): boolean {
    return this.eligibility === CatalogSubscriptionEligibilityType.SUBSCRIBED;
  }

  @requireFields('eligibility')
  get canEnrollThroughCatalogSubscriptionFreeTrial(): boolean {
    return this.eligibility === CatalogSubscriptionEligibilityType.TRIAL_ELIGIBLE;
  }

  @requireFields('eligibility')
  get canEnrollThroughCatalogSubscription(): boolean {
    return this.eligibility === CatalogSubscriptionEligibilityType.SUBSCRIPTION_ELIGIBLE;
  }

  @requireFields('eligibility')
  get canEnrollThroughCatalogSubscriptionUpgrade(): boolean {
    return this.eligibility === CatalogSubscriptionEligibilityType.UPGRADE_ELIGIBLE;
  }

  @requireFields('eligibility')
  get canSubscribeToCatalog(): boolean {
    return (
      this.canEnrollThroughCatalogSubscriptionFreeTrial ||
      this.canEnrollThroughCatalogSubscription ||
      this.canEnrollThroughCatalogSubscriptionUpgrade
    );
  }
}

export default CatalogSubscriptionEligibilitiesV1;
