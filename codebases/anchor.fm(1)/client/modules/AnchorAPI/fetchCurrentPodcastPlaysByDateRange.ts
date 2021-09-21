import { Podcast } from '../../types';
import { getEpochTime, getSecondsInTimeInterval } from './../Date';
import { TimeInterval } from './../Date/types';
import AnchorAPIError from './AnchorAPIError';

interface PlaysByEpochTime {
  [unixDatetime: number]: {
    playCount: number;
    topEpisodes?: [
      {
        name: string;
        playCount: number;
      }
    ];
  };
}

interface TopPlayedEpisodesByEpochTime {
  [unixDatetime: number]: [
    {
      name: string;
      playCount: number;
    }
  ];
}

interface PublishedEpisodesByEpochTime {
  [unixDatetime: number]: [
    {
      name: string;
    }
  ];
}

const decodePlaysResponseJson = (json: any): PlaysByEpochTime => {
  return json.data.rows.reduce(
    (accum: PlaysByEpochTime, row: any[]) => ({
      ...accum,
      [`${row[0]}`]: {
        playCount: row[1],
      },
    }),
    {}
  );
};

const decodeTopPlayedEpisodesResponseJson = (
  json: any
): TopPlayedEpisodesByEpochTime => {
  return json.data.rows.reduce(
    (accum: TopPlayedEpisodesByEpochTime, row: any[]) => {
      const episodesForEpochTime =
        accum[row[0]] === undefined
          ? [
              {
                name: json.data.labels.EpisodeTitle[row[1]],
                playCount: row[2],
              },
            ]
          : [
              ...accum[row[0]],
              {
                name: json.data.labels.EpisodeTitle[row[1]],
                playCount: row[2],
              },
            ];
      return {
        ...accum,
        [`${row[0]}`]: episodesForEpochTime,
      };
    },
    {}
  );
};

const decodePublishedEpisodesResponseJson = (
  json: any
): PublishedEpisodesByEpochTime => {
  return json.data.rows.reduce(
    (accum: PublishedEpisodesByEpochTime, row: any[]) => {
      const episodesForEpochTime =
        accum[row[1]] === undefined
          ? [
              {
                name: row[0],
              },
            ]
          : [
              ...accum[row[1]],
              {
                name: row[0],
              },
            ];
      return {
        ...accum,
        [`${row[1]}`]: episodesForEpochTime,
      };
    },
    {}
  );
};

// TODO: This endpoint can only support fetching up to 1000 episodes.
//       We should migrate this fetch to hit our main api
interface FetchCurrentPodcastPublishedEpisodesByDateRangeOptions {
  // userId: number,
  timeInterval?: TimeInterval;
  range?: {
    startDate: Date;
    endDate: Date;
  };
  maxCount?: number;
}

const fetchCurrentPodcastPublishedEpisodesByDateRange = (
  podcast: Podcast,
  {
    // userId,
    timeInterval = 'hour',
    range,
  }: FetchCurrentPodcastPublishedEpisodesByDateRangeOptions = {}
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<PublishedEpisodesByEpochTime>((resolve, reject) => {
    const intervalInSeconds = getSecondsInTimeInterval(timeInterval);
    const baseUrl = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/publishedEpisodes?timeInterval=${intervalInSeconds}`;
    const url = range
      ? `${baseUrl}&timeRangeStart=${getEpochTime(
          range.startDate
        )}&timeRangeEnd=${getEpochTime(range.endDate)}`
      : baseUrl;
    fetch(url, {
      credentials: 'same-origin',
      method: 'GET',
    }).then((response: any): void => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          // TODO: We should ad runtime checking to verify that the json can be converted to Episode[]
          const publishedEpisodesByEpoch = decodePublishedEpisodesResponseJson(
            responseJson
          );
          resolve(publishedEpisodesByEpoch);
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

interface GetCurrentPodcastPlaysByDateRangeRouteArgs {
  timeInterval?: TimeInterval;
  range?: {
    startDate: Date;
    endDate: Date;
  };
  maxCount?: number;
}

const getCurrentPodcastPlaysByDateRangeRoute = (
  podcast: Podcast,
  {
    timeInterval = 'hour',
    range,
  }: GetCurrentPodcastPlaysByDateRangeRouteArgs = {}
): string => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    throw new Error('only supports webId');
  }
  const intervalInSeconds = getSecondsInTimeInterval(timeInterval);
  const baseUrl = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/plays?timeInterval=${intervalInSeconds}`;
  const url = range
    ? `${baseUrl}&timeRangeStart=${getEpochTime(
        range.startDate
      )}&timeRangeEnd=${getEpochTime(range.endDate)}`
    : baseUrl;
  return url;
};

// TODO: This endpoint can only support fetching up to 1000 episodes.
//       We should migrate this fetch to hit our main api
interface FetchCurrentPodcastTopPlayedEpisodesByDateRange {
  // podcast: Podcast,
  // userId: number,
  timeInterval?: TimeInterval;
  range?: {
    startDate: Date;
    endDate: Date;
  };
  maxCount?: number;
}

const fetchCurrentPodcastTopPlayedEpisodesByDateRange = (
  podcast: Podcast,
  {
    // userId,
    timeInterval = 'hour',
    range,
    maxCount = 3,
  }: FetchCurrentPodcastTopPlayedEpisodesByDateRange = {}
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<TopPlayedEpisodesByEpochTime>((resolve, reject) => {
    const intervalInSeconds = getSecondsInTimeInterval(timeInterval);
    const baseUrl = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/playsByEpisode?timeInterval=${intervalInSeconds}&limit=${maxCount}`;
    const url = range
      ? `${baseUrl}&timeRangeStart=${getEpochTime(
          range.startDate
        )}&timeRangeEnd=${getEpochTime(range.endDate)}`
      : baseUrl;
    fetch(url, {
      credentials: 'same-origin',
      method: 'GET',
    }).then((response: any): void => {
      if (response.status === 200) {
        response.json().then((responseJson: any) => {
          // TODO: We should ad runtime checking to verify that the json can be converted to Episode[]
          const plays = decodeTopPlayedEpisodesResponseJson(responseJson);
          resolve(plays);
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

interface FetchCurrentPodcastPlaysByDateRangeArgs {
  // podcast: Podcast,
  // userId: number,
  timeInterval?: TimeInterval;
  range?: {
    startDate: Date;
    endDate: Date;
  };
  topEpisodesCountToInclude?: number;
  shouldIncludePublishedEpisodes?: boolean;
}
const fetchCurrentPodcastPlaysByDateRange = (
  podcast: Podcast,
  {
    timeInterval = 'hour',
    range,
    topEpisodesCountToInclude = 0,
    shouldIncludePublishedEpisodes = false,
  }: FetchCurrentPodcastPlaysByDateRangeArgs = {}
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  const url = getCurrentPodcastPlaysByDateRangeRoute(podcast, {
    timeInterval,
    range,
  });
  return fetch(url, {
    credentials: 'same-origin',
    method: 'GET',
  })
    .then((response: any): any => {
      if (response.ok) {
        return response
          .json()
          .then((responseJson: any) => {
            // TODO: We should ad runtime checking to verify that the json can be converted to Episode[]
            const playsByEpochTime: PlaysByEpochTime = decodePlaysResponseJson(
              responseJson
            );
            return Promise.resolve(playsByEpochTime);
          })
          .catch(() => {
            const error = new AnchorAPIError(
              response,
              `Server error: ${response.statusText} (${response.status}) - ${response.url}`
            );
            return Promise.reject(error);
          });
      }
      const error = new AnchorAPIError(
        response,
        `Server error: ${response.statusText} (${response.status}) - ${response.url}`
      );
      return Promise.reject(error);
    })
    .then((playsByEpochTime: PlaysByEpochTime) => {
      // What should any be here?
      if (topEpisodesCountToInclude > 0) {
        return fetchCurrentPodcastTopPlayedEpisodesByDateRange(podcast, {
          timeInterval,
          range,
          maxCount: topEpisodesCountToInclude,
        }).then(topPlayedEpisodesByEpochTime => {
          const playsWithTopEpisodes: PlaysByEpochTime = Object.keys(
            playsByEpochTime
          ).reduce((accum: PlaysByEpochTime, playEpochTimeKey: string) => {
            const topEpisodesForEpochTime =
              topPlayedEpisodesByEpochTime[Number(playEpochTimeKey)];
            const playDataForEpochTime =
              playsByEpochTime[Number(playEpochTimeKey)];
            if (topEpisodesForEpochTime === undefined) {
              return {
                ...accum,
                [playEpochTimeKey]: {
                  ...playDataForEpochTime,
                },
              };
            }
            return {
              ...accum,
              [playEpochTimeKey]: {
                ...{
                  ...playDataForEpochTime,
                  topEpisodes: topEpisodesForEpochTime,
                },
              },
            };
          }, {});
          return Promise.resolve(playsWithTopEpisodes);
        });
      }
      return Promise.resolve(playsByEpochTime);
    })
    .then((playsByEpochTime: PlaysByEpochTime) => {
      if (shouldIncludePublishedEpisodes) {
        return fetchCurrentPodcastPublishedEpisodesByDateRange(podcast, {
          timeInterval,
          range,
        }).then(publishedEpisodesByEpochTime => {
          const playsWithPublishedEpisodes: PlaysByEpochTime = Object.keys(
            playsByEpochTime
          ).reduce((accum: PlaysByEpochTime, playEpochTimeKey: string) => {
            const publishedEpisodesForEpochTime =
              publishedEpisodesByEpochTime[Number(playEpochTimeKey)];
            const playDataForEpochTime =
              playsByEpochTime[Number(playEpochTimeKey)];
            if (publishedEpisodesForEpochTime === undefined) {
              return {
                ...accum,
                [playEpochTimeKey]: {
                  ...playDataForEpochTime,
                },
              };
            }
            return {
              ...accum,
              [playEpochTimeKey]: {
                ...{
                  ...playDataForEpochTime,
                  publishedEpisodes: publishedEpisodesForEpochTime,
                },
              },
            };
          }, {});
          return Promise.resolve(playsWithPublishedEpisodes);
        });
      }
      return Promise.resolve(playsByEpochTime);
    });
};

export {
  fetchCurrentPodcastPlaysByDateRange,
  fetchCurrentPodcastTopPlayedEpisodesByDateRange,
  getCurrentPodcastPlaysByDateRangeRoute,
};
