import { getApiUrl } from '../../Url';

export type PartnerIdsResponse = { optimizely?: string; mparticle?: string };

export async function fetchPartnerIds(
  userId: number
): Promise<PartnerIdsResponse> {
  const urlPath = getApiUrl({ path: `${userId}/partnerIds` });

  try {
    const response = await fetch(urlPath, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ userId }),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not fetch Partner Ids`);
  } catch (err) {
    throw new Error(err.message);
  }
}
