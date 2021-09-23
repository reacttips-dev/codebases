import { PaywallAnalytics } from './types';

export async function fetchPaywallAnalytics({
  webStationId,
}: {
  webStationId: string;
}): Promise<PaywallAnalytics> {
  try {
    const response = await fetch(
      `/api/proxy/v3/paywalls/webStationId:${webStationId}/analytics`,
      { method: 'GET', credentials: 'same-origin' }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch subscription analytics');
  } catch (err) {
    throw new Error(err.message);
  }
}
