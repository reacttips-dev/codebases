import find from 'lodash/find';
import logger from 'js/app/loggerSingleton';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import BillingCycleType from 'bundles/subscriptions/common/BillingCycleType';

export const getSubscriptionSkuId = (availableS12nSubscriptions: $TSFixMe, billingType: $TSFixMe): string | null => {
  const subscription = find(availableS12nSubscriptions, (sub) => {
    const billingCycle = sub.productProperties && sub.productProperties.billingCycle;
    return billingCycle === billingType;
  });
  if (subscription) {
    return subscription.productItemId;
  } else {
    logger.warn(`There are no available subscriptions of type ${billingType}`);
    return null;
  }
};

export const getS12nMonthlySkuId = (
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1,
  s12nId?: string
): string | null => {
  if (!enrollmentAvailableChoices || !s12nId) {
    return null;
  }

  const s12nEnrollmentData = enrollmentAvailableChoices.getS12nSubscriptionEnrollmentData(s12nId);
  const { availableSubscriptions } = s12nEnrollmentData.enrollmentChoiceData.definition;
  return getSubscriptionSkuId(availableSubscriptions, BillingCycleType.MONTHLY);
};

export default {
  getSubscriptionSkuId,
  getS12nMonthlySkuId,
};
