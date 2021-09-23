import { getApiUrl } from '../../../Url';
import AnchorAPIError from '../../AnchorAPIError';

export type ImportRssFeedParameters = {
  stationId: string;
  userId: number;
  feedUrl: string;
};

const getEndpointUrl = (stationId: string) =>
  getApiUrl({ path: `stations/webStationId:${stationId}/import` });

export const importRssFeed = async ({
  stationId,
  userId,
  feedUrl,
}: ImportRssFeedParameters) => {
  const url = getEndpointUrl(stationId);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      userId,
      rssFeedUrl: feedUrl,
    }),
  });
  if (response.ok) {
    return response.json();
  }

  const { status, statusText } = response;
  throw new AnchorAPIError(response, `${status} - ${statusText}`);
};
