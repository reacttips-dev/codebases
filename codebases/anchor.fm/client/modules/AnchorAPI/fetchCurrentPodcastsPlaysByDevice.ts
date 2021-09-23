import { PlayData, Podcast } from '../../types';
import AnchorAPIError from './AnchorAPIError';

// TODO: Should we make this type more robust by specifying the possible platforms?
interface PlaysByDevice {
  [device: string]: {
    percentOfPlays: number;
  };
}

const decodeResponseIntoPlaysByDevice = (json: any): PlaysByDevice =>
  json.data.rows.reduce(
    (playsByDeviceAccum: PlaysByDevice, row: any) => ({
      ...playsByDeviceAccum,
      [row[0]]: {
        percentOfPlays: row[1],
      },
    }),
    {}
  );
interface GetCurrentPodcastsPlaysByDeviceRouteArgs {
  minValue?: number;
}
const getCurrentPodcastsPlaysByDeviceRoute = (
  podcast: Podcast,
  { minValue = 0.02 }: GetCurrentPodcastsPlaysByDeviceRouteArgs = {}
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    throw new Error('only supports webId');
  }
  const urlPath = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/playsByDevice?minValue=${minValue}`;
  return urlPath;
};

interface FetchCurrentPodcastsPlaysByDeviceArgs {
  minValue?: number;
}
const fetchCurrentPodcastsPlaysByDevice = (
  podcast: Podcast,
  { minValue = 0.02 }: FetchCurrentPodcastsPlaysByDeviceArgs = {}
) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<PlaysByDevice>((resolve, reject) => {
    const urlPath = getCurrentPodcastsPlaysByDeviceRoute(podcast, {
      minValue,
    });
    return fetch(urlPath, {
      credentials: 'same-origin',
    }).then(response => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          const playsByDevice = decodeResponseIntoPlaysByDevice(responseJson);
          resolve(playsByDevice);
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
  fetchCurrentPodcastsPlaysByDevice,
  getCurrentPodcastsPlaysByDeviceRoute,
};
