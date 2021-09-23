import { Podcast } from '../../types';
import { getEpochTime } from './../Date';
import AnchorAPIError from './AnchorAPIError';

interface TopPlayedEpisode {
  name: string;
  playCount: number;
}

const decodeResponseJsonIntoTopPlayedEpisodes = (
  json: any
): TopPlayedEpisode[] => {
  return json.data.rows.map((row: any) => {
    const episodeName = row[0];
    return {
      name: episodeName,
      playCount: row[1],
      publishedDateEpochTime: row[2],
    };
  });
};

interface GetTopPlayedEpisodesRouteArgs {
  // podcast: Podcast;
  range?: {
    startDate: Date;
    endDate: Date;
  };
  maxEpisodesCount: number;
}
const getCurrentPodcastsTopPlayedEpisodesRoute = (
  podcast: Podcast,
  {
    // podcast,
    maxEpisodesCount = 3,
    range,
  }: FetchTopPlayedEpisodesArgs
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    throw new Error('only supports webId');
  }
  const baseUrl = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/topEpisodes?limit=${maxEpisodesCount}`;
  const url = range
    ? `${baseUrl}&timeRangeStart=${getEpochTime(
        range.startDate
      )}&timeRangeEnd=${getEpochTime(range.endDate)}`
    : baseUrl;
  return url;
};

interface FetchTopPlayedEpisodesArgs {
  // podcast: Podcast;
  range?: {
    startDate: Date;
    endDate: Date;
  };
  maxEpisodesCount: number;
}
const fetchCurrentPodcastsTopPlayedEpisodes = (
  podcast: Podcast,
  {
    // podcast,
    maxEpisodesCount = 3,
    range,
  }: FetchTopPlayedEpisodesArgs
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<TopPlayedEpisode[]>((resolve, reject) => {
    const url = getCurrentPodcastsTopPlayedEpisodesRoute(podcast, {
      maxEpisodesCount,
      range,
    });
    fetch(url, {
      credentials: 'same-origin',
      method: 'GET',
    }).then((response: any): void => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          // TODO: We should ad runtime checking to verify that the json can be converted to Episode[]
          const topPlayedEpisodes = decodeResponseJsonIntoTopPlayedEpisodes(
            responseJson
          );
          resolve(topPlayedEpisodes);
        });
      } else {
        const error = new AnchorAPIError(
          response,
          `Server error: ${response.statusText} (${response.status}) - ${response.url}`
        );
        reject(error);
      }
    });
  });
};

export {
  fetchCurrentPodcastsTopPlayedEpisodes,
  getCurrentPodcastsTopPlayedEpisodesRoute,
};
