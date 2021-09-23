export type FetchTermsAndConditionsResponse = {
  url: string;
};

export async function fetchTermsAndConditions(
  countryCode?: string
): Promise<FetchTermsAndConditionsResponse> {
  try {
    const response = await fetch(`/api/proxy/v3/span/terms/${countryCode}`, {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Unable to fetch Terms and Conditions`);
  } catch (err) {
    throw new Error(err.message);
  }
}
