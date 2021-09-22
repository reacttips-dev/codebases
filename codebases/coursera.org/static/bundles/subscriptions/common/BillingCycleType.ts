import keysToConstants from 'js/lib/keysToConstants';

const billingCycleTypes = keysToConstants(['MONTHLY', 'BIANNUAL', 'ANNUAL']);

export type BillingCycleTypesValues = typeof billingCycleTypes[keyof typeof billingCycleTypes];

export const { MONTHLY, BIANNUAL, ANNUAL } = billingCycleTypes;

export const monthsForBillingType = function ({ billingCycle }: { billingCycle: BillingCycleTypesValues }) {
  if (billingCycle === billingCycleTypes.ANNUAL) {
    return 12;
  } else if (billingCycle === billingCycleTypes.BIANNUAL) {
    return 6;
  } else {
    return null;
  }
};

export default billingCycleTypes;
