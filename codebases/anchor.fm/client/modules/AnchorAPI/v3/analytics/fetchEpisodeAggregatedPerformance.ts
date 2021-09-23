// /v3/analytics/episode/:episodeId/aggregatedPerformance?userId=203825

import { getApiUrl } from '../../../Url';
import {
  EpisodeAggregatedPerformanceParams,
  EpisodeAggregatedPerformanceResponse,
} from './types';

export async function fetchEpisodeAggregatedPerformance({
  webEpisodeId,
}: EpisodeAggregatedPerformanceParams): Promise<
  EpisodeAggregatedPerformanceResponse
> {
  try {
    const response = await fetch(
      getAggregatedPerformanceUrl({
        webEpisodeId,
      }),
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Could not fetch this episode's aggregated performance`);
  } catch (err) {
    throw new Error(err.message);
  }
}

export function getAggregatedPerformanceUrl({
  webEpisodeId,
}: EpisodeAggregatedPerformanceParams) {
  return getApiUrl({
    path: `analytics/episode/webEpisodeId:${webEpisodeId}/aggregatedPerformance`,
  });
}
