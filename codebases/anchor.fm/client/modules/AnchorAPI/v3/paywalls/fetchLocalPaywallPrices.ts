import { PaywallPrice } from 'types/Metadata';

export type FetchLocalPaywallPricesResponse = {
  prices: PaywallPrice[];
};

export async function fetchLocalPaywallPrices(
  countryCode: string,
  tier: string | undefined
): Promise<FetchLocalPaywallPricesResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/paywalls/prices/country/${countryCode}/tier/${tier}`,
      {
        method: 'GET',
      }
    );

    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not retrieve listener price tier.`);
  } catch (err) {
    throw new Error(err.message);
  }
}
