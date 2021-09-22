// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';

import type CatalogSubscriptionEligibilitiesV1 from 'bundles/naptimejs/resources/catalogSubscriptionEligibilities.v1';
import type { EnrollmentChoiceTypesValues } from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import {
  SUBSCRIBE_TO_CATALOG,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
} from 'bundles/enroll-course/common/EnrollmentChoiceTypes';

import { MONTHLY } from 'bundles/subscriptions/common/BillingCycleType';
import subscriptionPriceUtils from 'bundles/s12n-common/utils/subscriptionPriceUtils';

class CatalogSubscriptionsEnrollmentState {
  subscriptionEligibilityTypeSource: EnrollmentAvailableChoicesV1 | CatalogSubscriptionEligibilitiesV1;

  enrollmentAvailableChoices: any | undefined;

  catalogSubscriptionEligibilities: any | undefined;

  constructor(
    enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1,
    catalogSubscriptionEligibilities?: CatalogSubscriptionEligibilitiesV1
  ) {
    if (!(enrollmentAvailableChoices || catalogSubscriptionEligibilities)) {
      throw new Error('No catalog subscription eligibility source');
    }

    this.subscriptionEligibilityTypeSource = enrollmentAvailableChoices || catalogSubscriptionEligibilities;

    this.enrollmentAvailableChoices = enrollmentAvailableChoices;
    this.catalogSubscriptionEligibilities = catalogSubscriptionEligibilities;
  }

  get canEnrollThroughFreeTrial(): boolean {
    return this.subscriptionEligibilityTypeSource.canEnrollThroughCatalogSubscriptionFreeTrial;
  }

  get canEnrollThroughCatalogSubscription(): boolean {
    return this.subscriptionEligibilityTypeSource.canEnrollThroughCatalogSubscription;
  }

  get canEnrollThroughCatalogSubscriptionUpgrade(): boolean {
    return this.subscriptionEligibilityTypeSource.canEnrollThroughCatalogSubscriptionUpgrade;
  }

  get availableCatalogSubscriptions() {
    return this.subscriptionEligibilityTypeSource.availableCatalogSubscriptions;
  }

  get monthlyCatalogSubscriptionSkuId(): string {
    const productSkuId = subscriptionPriceUtils.getSubscriptionSkuId(this.availableCatalogSubscriptions, MONTHLY);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return productSkuId!;
  }

  get eligibility(): string {
    const { catalogSubscriptionEligibilities } = this;
    return catalogSubscriptionEligibilities ? catalogSubscriptionEligibilities.eligibility : null;
  }

  get isSubscribed(): boolean {
    const { enrollmentAvailableChoices, catalogSubscriptionEligibilities } = this;
    return (
      (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscribed) ||
      (catalogSubscriptionEligibilities && catalogSubscriptionEligibilities.isSubscribed)
    );
  }

  get canSubscribeToCatalog(): boolean {
    return this.subscriptionEligibilityTypeSource.canSubscribeToCatalog;
  }

  get enrollmentChoiceType(): EnrollmentChoiceTypesValues | null {
    if (this.canEnrollThroughFreeTrial) {
      return SUBSCRIBE_TO_CATALOG_TRIAL;
    } else if (this.canEnrollThroughCatalogSubscription) {
      return SUBSCRIBE_TO_CATALOG;
    } else if (this.canEnrollThroughCatalogSubscriptionUpgrade) {
      return UPGRADE_TO_CATALOG_SUBSCRIPTION;
    } else {
      return null;
    }
  }
}

export default CatalogSubscriptionsEnrollmentState;
