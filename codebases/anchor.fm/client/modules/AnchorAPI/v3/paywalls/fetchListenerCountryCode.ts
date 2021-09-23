export type FetchListenerCountryCodeResponse = {
  countryCode: string;
};

export async function fetchListenerCountryCode(): Promise<FetchListenerCountryCodeResponse> {
  try {
    const response = await fetch('/api/v3/listenerCountryCode', {
      method: 'POST',
      credentials: 'same-origin',
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not retrieve listener country code.`);
  } catch (err) {
    throw new Error(err.message);
  }
}
