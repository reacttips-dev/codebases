import { idToDate, dateDifferenceInDays } from '@trello/dates';
import { ProductFeatures } from '@trello/product-features';

export enum TrialSource {
  Moonshot = 'moonshot',
  UpgradePrompt = 'upgrade-prompt',
}

export interface Credit {
  id: string;
  count: number;
  type: string;
}

export interface PaidAccount {
  trialExpiration: string;
}

interface FreeTrialProperties {
  isActive: boolean;
  expiresAt: Date;
  isExpired: boolean;
  days: number;
  daysLeft: number | null;
  startDate: Date;
  credit: Credit;
  trialSource: TrialSource;
}

export const getFreeTrialProperties = (
  credits: Credit[],
  products: number[],
  trialExpiration: string,
): null | FreeTrialProperties => {
  const freeTrialCredit = credits
    .slice()
    .sort((a, b) => (b.id > a.id ? 1 : -1)) // to get the most recent free trial credit
    .find((credit) => credit.type === 'freeTrial');

  if (!freeTrialCredit) {
    return null;
  }

  const startDate = idToDate(freeTrialCredit.id);
  const days = freeTrialCredit.count;

  // endDate is the start date of the credit + the count (free trial length in days)
  // This is a backup for when the workpace paidAccount.trialExpiration is unavailable (ex: for non-admins)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);

  const expiresAt = new Date(trialExpiration || endDate);
  const daysLeft = expiresAt
    ? Math.ceil(dateDifferenceInDays(new Date(), expiresAt, true))
    : null;
  const isActive =
    daysLeft !== null &&
    daysLeft > 0 &&
    ProductFeatures.isBusinessClassProduct(products[0]);
  return {
    isActive,
    expiresAt,
    isExpired: !!freeTrialCredit && !isActive,
    days,
    daysLeft,
    startDate,
    credit: freeTrialCredit,
    trialSource: days === 14 ? TrialSource.UpgradePrompt : TrialSource.Moonshot,
  };
};

export const hasFreeTrialCredit = (credits: Credit[] = []) => {
  return credits.some((credit) => credit.type === 'freeTrial');
};
