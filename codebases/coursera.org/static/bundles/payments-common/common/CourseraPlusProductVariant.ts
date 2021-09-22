import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

export const courseraPlusProductVariants = {
  ANNUAL_NO_FREE_TRIAL: '-0etFmEeipcQojwuFOIA',
  ANNUAL_SEVEN_DAY_FREE_TRIAL: '6kTHyIDqEeqBu_61xj9e0Q',
  MONTHLY_WITH_FREE_TRIAL: 'LbAwD6QzEeqeDWZSF5SmzA',
  MONTHLY_UPSELL_UPGRADE: 'rfUDqMi1T8OXIAi9tk2RTw',
  AMEX_PROMO: 'Eg4WA6MoTZSZfjVquktb3Q',
} as const;

const cycleValue = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
} as const;

type CourseraPlusProductVariantDetail = {
  cycle: typeof cycleValue[keyof typeof cycleValue];
  hasFreeTrial: boolean;
};

export const courseraPlusProductVariantDetails = (
  productVariant: CourseraPlusProductVariant
): CourseraPlusProductVariantDetail | null => {
  switch (productVariant) {
    case courseraPlusProductVariants.ANNUAL_NO_FREE_TRIAL:
      return { cycle: cycleValue.ANNUAL, hasFreeTrial: false };
    case courseraPlusProductVariants.ANNUAL_SEVEN_DAY_FREE_TRIAL:
      return { cycle: cycleValue.ANNUAL, hasFreeTrial: true };
    case courseraPlusProductVariants.MONTHLY_WITH_FREE_TRIAL:
    case courseraPlusProductVariants.MONTHLY_UPSELL_UPGRADE:
    case courseraPlusProductVariants.AMEX_PROMO:
      return { cycle: cycleValue.MONTHLY, hasFreeTrial: true };
    default:
      return null;
  }
};

export default courseraPlusProductVariants;

export type CourseraPlusProductVariant = typeof courseraPlusProductVariants[keyof typeof courseraPlusProductVariants];

export const isMonthlyWithFreeTrial = (itemId: CourseraPlusProductVariant): boolean => {
  return itemId === courseraPlusProductVariants.MONTHLY_WITH_FREE_TRIAL;
};

export const isAnnualSevenDayFreeTrial = (itemId: CourseraPlusProductVariant): boolean => {
  return itemId === courseraPlusProductVariants.ANNUAL_SEVEN_DAY_FREE_TRIAL;
};

// the sku looks like  : CourseraPlusSubscription~LbAwD6QzEeqeDWZSF5SmzA
// we need the tail part only
const idFromSku = (sku: string): CourseraPlusProductVariant | undefined => {
  return (stringKeyToTuple(sku)[1] as CourseraPlusProductVariant) ?? undefined;
};

export const isMonthly = (productSku: string): boolean => {
  const itemId = idFromSku(productSku);
  return courseraPlusProductVariantDetails(itemId!)?.cycle === cycleValue.MONTHLY;
};

export const isYearly = (productSku: string): boolean => {
  const itemId = idFromSku(productSku);
  return courseraPlusProductVariantDetails(itemId!)?.cycle === cycleValue.ANNUAL;
};

export const isMonthlyByVariantId = (id: CourseraPlusProductVariant): boolean => {
  return courseraPlusProductVariantDetails(id)?.cycle === cycleValue.MONTHLY;
};

export const isAnnualByVariantId = (id: CourseraPlusProductVariant): boolean => {
  return courseraPlusProductVariantDetails(id)?.cycle === cycleValue.ANNUAL;
};

export const hasFreeTrialByVariantId = (id: CourseraPlusProductVariant): boolean => {
  return courseraPlusProductVariantDetails(id)?.hasFreeTrial ?? false;
};
