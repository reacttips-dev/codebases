import { getApiUrl } from '../Url';
import AnchorAPIError from './AnchorAPIError';

export type EpisodePerformanceResponse = {
  episodeId: number;
  kind: string;
  data: {
    rows: [number, string][];
  };
  columnHeaders: {
    name: string;
    type: string;
  }[];
};

export type EpisodePerformanceParameters = {
  webEpisodeId: string;
};

export const fetchEpisodePerformanceUrl = (webEpisodeId: string) =>
  getApiUrl({
    path: `analytics/episode/webEpisodeId:${webEpisodeId}/performance`,
  });

export const fetchEpisodePerformance = async ({
  webEpisodeId,
}: EpisodePerformanceParameters) => {
  const url = fetchEpisodePerformanceUrl(webEpisodeId);
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
