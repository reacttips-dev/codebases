import { BillingDates, ExpirationDates } from '@trello/product-features';

/**
 * Get the next billing date for a give paidAccount
 * object. Looks up the date string for the product
 * and converts it to a Date. Returns null if not
 * applicable
 */
export const getNextBillingDate = (
  paidAccount?: {
    products: number[];
    billingDates: BillingDates;
  } | null,
): Date | null => {
  const product = paidAccount?.products?.[0];
  const billingDates = paidAccount?.billingDates;
  if (
    !product ||
    !billingDates ||
    !Object.prototype.hasOwnProperty.call(billingDates, product)
  ) {
    return null;
  }
  return new Date(billingDates[product]);
};

/**
 * Get the expiration date for a give paidAccount
 * object. Looks up the date string for the product
 * and converts it to a Date. Returns null if not
 * applicable
 */
export const getExpirationDate = (
  paidAccount?: {
    products: number[];
    expirationDates: ExpirationDates;
  } | null,
): Date | null => {
  const product = paidAccount?.products?.[0];
  const expirationDates = paidAccount?.expirationDates;
  if (
    !product ||
    !expirationDates ||
    !Object.prototype.hasOwnProperty.call(expirationDates, product)
  ) {
    return null;
  }
  return new Date(expirationDates[product]);
};
