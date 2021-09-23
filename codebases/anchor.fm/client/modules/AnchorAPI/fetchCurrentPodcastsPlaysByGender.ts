import { getApiUrl } from '../Url';
import AnchorAPIError from './AnchorAPIError';

export type CurrentPodcastsPlaysByGenderResponse = {
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

export type CurrentPodcastsPlaysByGenderParameters = {
  webStationId: string;
  timeRangeStart: number;
  timeRangeEnd: number;
};

export const getCurrentPodcastsPlaysByGenderUrl = (
  webStationId: string,
  timeRangeStart: number,
  timeRangeEnd: number,
  csvFilename?: string
) =>
  getApiUrl({
    path: `analytics/station/webStationId:${webStationId}/playsByGender`,
    queryParameters: { timeRangeStart, timeRangeEnd, csvFilename },
  });

export const fetchCurrentPodcastsPlaysByGender = async ({
  webStationId,
  timeRangeStart,
  timeRangeEnd,
}: CurrentPodcastsPlaysByGenderParameters) => {
  const url = getCurrentPodcastsPlaysByGenderUrl(
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
