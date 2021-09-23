import { getApiUrl } from '../Url';
import AnchorAPIError from './AnchorAPIError';

export type CurrentPodcastsPlaysByAgeRangeResponse = {
  stationId: number;
  kind: string;
  parameters: {
    timeRange: [number, number];
  };
  data: {
    rows: [string, number][];
    columnHeaders: {
      name: string;
      type: string;
    };
    colors: { [key: string]: string };
  };
};

export type CurrentPodcastsPlaysByAgeRangeParameters = {
  webStationId: string;
  timeRangeStart: number;
  timeRangeEnd: number;
};

export const getCurrentPodcastsPlaysByAgeRangeUrl = (
  webStationId: string,
  timeRangeStart: number,
  timeRangeEnd: number,
  csvFilename?: string
) =>
  getApiUrl({
    path: `analytics/station/webStationId:${webStationId}/playsByAgeRange`,
    queryParameters: { timeRangeStart, timeRangeEnd, csvFilename },
  });

export const fetchCurrentPodcastsPlaysByAgeRange = async ({
  webStationId,
  timeRangeStart,
  timeRangeEnd,
}: CurrentPodcastsPlaysByAgeRangeParameters) => {
  const url = getCurrentPodcastsPlaysByAgeRangeUrl(
    webStationId,
    timeRangeStart,
    timeRangeEnd
  );
  const response = await fetch(url, {
    credentials: 'same-origin',
  });

  if (response.ok) {
    return response.json();
  }

  const { status, type } = response;
  throw new AnchorAPIError(
    response,
    `Non-200 response status: ${status} (${type})`
  );
};
