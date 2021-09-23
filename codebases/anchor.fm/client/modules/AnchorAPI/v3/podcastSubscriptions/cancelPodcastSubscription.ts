import { CancelPodcastSubscriptionResponse } from './types';

type CancelPodcastSubscriptionParameters = {
  webStationId: string;
  code: string;
};

export async function cancelPodcastSubscription({
  webStationId,
  code,
}: CancelPodcastSubscriptionParameters): Promise<CancelPodcastSubscriptionResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/podcastSubscriptions/webStationId:${webStationId}/cancel`,
      {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ code }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Could not cancel subscription.');
  } catch (err) {
    throw new Error(err.message);
  }
}
