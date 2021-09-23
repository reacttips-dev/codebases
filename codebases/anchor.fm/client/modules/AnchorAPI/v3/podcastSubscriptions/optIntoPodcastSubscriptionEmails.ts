import { OptIntoPodcastSubscriptionEmailsResponse } from './types';

type OptIntoPodcastSubscriptionEmailParameters = {
  webStationId: string;
  code: string;
};

export async function optIntoPodcastSubscriptionEmails({
  webStationId,
  code,
}: OptIntoPodcastSubscriptionEmailParameters): Promise<OptIntoPodcastSubscriptionEmailsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/podcastSubscriptions/webStationId:${webStationId}/optIn`,
      {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ code }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Could not opt into podcast subscription emails.');
  } catch (err) {
    throw new Error(err.message);
  }
}
