import { PaywallMetadata } from '../../../../types/Metadata';

export async function fetchPaywallMetadata({
  webStationId,
}: {
  webStationId: string;
}): Promise<PaywallMetadata> {
  try {
    const response = await fetch(
      `/api/proxy/v3/paywalls/webStationId:${webStationId}/`,
      { method: 'GET', credentials: 'same-origin' }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch subscription metadata');
  } catch (err) {
    throw new Error(err.message);
  }
}
