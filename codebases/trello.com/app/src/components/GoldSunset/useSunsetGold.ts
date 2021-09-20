import {
  ProductFeatures,
  BillingDates,
  ExpirationDates,
} from '@trello/product-features';
import {
  isActive,
  getNextBillingDate,
  getExpirationDate,
} from '@trello/paid-account';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { getDate } from 'app/common/lib/util/date';
import moment from 'moment';

interface GoldSunsetData {
  goldSunsetEnabled: boolean;
  goldIsActive: boolean;
  goldIsExpiring: boolean;
  canRenewGold: boolean;
  goldSunsetDate: string;
  goldExpirationDate: string;
  goldHasRemainingBillingCycles: boolean;
}

export const GOLD_SUNSET_DATE = new Date('9/24/2021');

/** Get the expiration date for a workspace on an old BC SKU
 * in an active, non-cancelled state
 */
const getGoldExpirationDate = (
  products: number[],
  nextBillingDate?: string,
): string => {
  if (!nextBillingDate || !products?.[0]) return '';

  const momentDate = moment(nextBillingDate);

  // if the next bill date is after the sunset date, return next bill date
  if (momentDate.isAfter(GOLD_SUNSET_DATE, 'day')) return nextBillingDate;

  // if the next bill date is on or before the sunset date, the subscription can be renewed,
  // so return the next bill date that would occur after the sunset date
  return getGoldExpirationDate(
    products,
    momentDate
      .add(1, ProductFeatures.isMonthly(products[0]) ? 'month' : 'year')
      .toISOString(),
  );
};

export const useSunsetGold = ({
  products,
  standing,
  billingDates,
  expirationDates,
  skip,
}: {
  products: number[];
  standing: number;
  billingDates: BillingDates;
  expirationDates: ExpirationDates;
  skip?: boolean;
}): GoldSunsetData => {
  // Skip if not on an old BC SKU
  const goldSunsetEnabled = useFeatureFlag(
    'nusku.repackaging-gtm.gold-sunset',
    false,
  );
  if (!goldSunsetEnabled || skip)
    return {
      goldSunsetEnabled: false,
      goldIsActive: false,
      goldIsExpiring: false,
      canRenewGold: false,
      goldSunsetDate: '',
      goldExpirationDate: '',
      goldHasRemainingBillingCycles: false,
    };

  // Can they renew?
  const goldSunsetDate = GOLD_SUNSET_DATE.toISOString();
  const sunsetDateHasPassed = moment(goldSunsetDate).isBefore(getDate(), 'day');
  const canRenewGold = !sunsetDateHasPassed;

  // When will their account expire?
  const goldIsActive = isActive({ products, standing });
  const expirationDate =
    getExpirationDate({
      products,
      expirationDates,
    })?.toISOString() || '';
  const goldIsExpiring = goldIsActive && !!expirationDate; // cancelled but still active
  const nextBillingDate = getNextBillingDate({ products, billingDates });
  const goldExpirationDate = goldIsExpiring
    ? expirationDate
    : getGoldExpirationDate(products, nextBillingDate?.toISOString());
  const goldHasRemainingBillingCycles = moment(nextBillingDate ?? '').isBefore(
    goldSunsetDate,
  );

  return {
    goldSunsetEnabled,
    goldIsActive,
    goldIsExpiring,
    canRenewGold,
    goldSunsetDate,
    goldExpirationDate,
    goldHasRemainingBillingCycles,
  };
};
