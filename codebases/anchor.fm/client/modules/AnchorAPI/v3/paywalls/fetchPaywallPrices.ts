// GET v3/paywalls/prices

import { PaywallPrice } from '../../../../types/Metadata';

export type FetchPaywallPricesResponse = {
  prices: PaywallPrice[];
};

export async function fetchPaywallsPrices(): Promise<FetchPaywallPricesResponse> {
  try {
    const response = await fetch(`/api/proxy/v3/paywalls/prices`, {
      method: 'GET',
      credentials: 'same-origin',
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not retrieve paywalls prices.`);
  } catch (err) {
    throw new Error(err.message);
  }
}
