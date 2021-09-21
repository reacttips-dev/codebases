import { PlayData, Podcast } from '../../types';
import AnchorAPIError from './AnchorAPIError';

// TODO: Should we make this type more robust by specifying the possible platforms?
interface PlaysByApp {
  [app: string]: {
    percentOfPlays: number;
  };
}

const decodeResponseIntoPlaysByApp = (json: any): PlaysByApp =>
  json.data.rows.reduce(
    (playsByAppAccum: PlaysByApp, row: any) => ({
      ...playsByAppAccum,
      [row[0]]: {
        percentOfPlays: row[1],
      },
    }),
    {}
  );

interface GetCurrentPodcastsPlaysByAppRouteArgs {
  minValue?: number;
}
const getCurrentPodcastsPlaysByAppRoute = (
  podcast: Podcast,
  { minValue = 0.02 }: GetCurrentPodcastsPlaysByAppRouteArgs = {}
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    throw new Error('only supports webId');
  }
  const urlPath = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/playsByApp?minValue=${minValue}`;
  return urlPath;
};
interface FetchCurrentPodcastsPlaysByAppArgs {
  minValue?: number;
}
const fetchCurrentPodcastsPlaysByApp = (
  podcast: Podcast,
  { minValue = 0.02 }: FetchCurrentPodcastsPlaysByAppArgs = {}
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<PlaysByApp>((resolve, reject) => {
    const urlPath = getCurrentPodcastsPlaysByAppRoute(podcast, {
      minValue,
    });
    fetch(urlPath, {
      credentials: 'same-origin',
    }).then(response => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          const playsByApp = decodeResponseIntoPlaysByApp(responseJson);
          resolve(playsByApp);
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

export { fetchCurrentPodcastsPlaysByApp, getCurrentPodcastsPlaysByAppRoute };
