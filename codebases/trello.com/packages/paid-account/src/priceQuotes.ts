/**
 * Use for getting the quote for the right product from the
 * price quotes API response
 */
export const getPriceQuoteForProduct = <
  T extends { ixSubscriptionProduct: number }
>(
  product: number,
  priceQuoteInfo?: { annual?: T | null; monthly?: T | null } | null,
): T | null => {
  for (const quote of Object.values<T | null | undefined>(
    (priceQuoteInfo ?? {}) as { annual?: T | null; monthly?: T | null },
  )) {
    if (quote?.ixSubscriptionProduct === product) {
      return quote;
    }
  }
  return null;
};
