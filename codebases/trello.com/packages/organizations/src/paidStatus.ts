// eslint-disable-next-line no-restricted-imports
import { PremiumFeatures } from '@trello/graphql/generated';
import { ProductFeatures } from '@trello/product-features';
import { getFreeTrialProperties, Credit, PaidAccount } from './freeTrial';

type PaidStatus = 'ENT' | 'FREE_TRIAL' | 'BUS' | 'FREE' | 'UNKNOWN';

export function getOrgPaidStatus(
  org?: {
    id?: string;
    name?: string;
    products?: number[];
    idEnterprise?: string | null;
    premiumFeatures?: PremiumFeatures[] | null;
    credits?: Credit[] | null;
    paidAccount?: PaidAccount | null;
  } | null,
): PaidStatus {
  const credits = org?.credits || [];
  const products = org?.products || [];
  const idEnterprise = org?.idEnterprise;
  const premiumFeatures = org?.premiumFeatures || [];
  const orgName = org?.name;

  const isEnterprise =
    Boolean(idEnterprise) && premiumFeatures.includes('enterpriseUI');
  const isBusinessClass =
    !isEnterprise && products.some(ProductFeatures.isBusinessClassProduct);
  const isFreeTrial = Boolean(
    getFreeTrialProperties(
      credits,
      products,
      org?.paidAccount?.trialExpiration || '',
    )?.isActive,
  );
  //if we have access to the orgName, we know that the org is readable by the user
  const isFree = !isEnterprise && !isBusinessClass && orgName;

  if (isEnterprise) {
    return 'ENT';
  } else if (isBusinessClass) {
    return isFreeTrial ? 'FREE_TRIAL' : 'BUS';
  } else if (isFree) {
    return 'FREE';
  } else {
    return 'UNKNOWN';
  }
}
