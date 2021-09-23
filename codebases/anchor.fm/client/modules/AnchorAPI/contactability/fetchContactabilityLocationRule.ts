export enum ContactabilityStatus {
  OPTED_IN = 'optedIn',
  OPTED_OUT = 'optedOut',
  OPTED_IN_SECONDARY_RESPONSE = 'optedInSecondaryResponseRequired',
  NEEDS_RESPONSE_OPT_IN = 'needsResponseOptInSelected',
  NEEDS_RESPONSE_OPT_OUT = 'needsResponseOptOutSelected',
}

type Response = {
  countryRule: ContactabilityStatus | null;
};

export async function fetchContactabilityLocationRule(): Promise<Response> {
  try {
    const response = await fetch(`/api/proxy/v3/contactability/location_rule`, {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('No location rule');
  } catch (err) {
    throw new Error(err.message);
  }
}
