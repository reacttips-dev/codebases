import { getApiUrl } from '../../../Url';
import { SubscriberEmailListResponse } from './types';

export async function fetchSubscriberEmailList({
  userId,
  webStationId,
}: {
  userId: number;
  webStationId: string;
}): Promise<SubscriberEmailListResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/podcastSubscriptions/webStationId:${webStationId}/subscriberEmailList?userId=${userId}`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch subscriber email list');
  } catch (err) {
    throw new Error(err.message);
  }
}

export function getSubscriberEmailListUrl({
  userId,
  webStationId,
  csvFilename,
}: {
  userId: string;
  webStationId: string;
  csvFilename?: string;
}): string {
  return getApiUrl({
    path: `podcastSubscriptions/webStationId:${webStationId}/subscriberEmailList`,
    queryParameters: { userId, csvFilename },
  });
}
