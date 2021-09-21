import { Promise } from 'bluebird';
import { Podcast } from './../../types';
import AnchorAPIError from './AnchorAPIError';

const decodeTotalPlaysResponseIntoTotalPlays = (json: any): Number =>
  json.data.rows[0];

const fetchCurrentPodcastsTotalPlays = (podcast: Podcast) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<Number>((resolve, reject) => {
    const urlPath = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/totalPlays`;
    fetch(urlPath, {
      credentials: 'same-origin',
    }).then(response => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          const totalPlays = decodeTotalPlaysResponseIntoTotalPlays(
            responseJson
          );
          resolve(totalPlays);
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

const decodeAudienceSizeResponseIntoAudienceSize = (json: any): Number =>
  json.data.rows[0];

const fetchCurrentPodcastsAudienceSize = (podcast: Podcast) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<Number>((resolve, reject) => {
    const urlPath = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/audienceSize`;
    fetch(urlPath, {
      credentials: 'same-origin',
    }).then(response => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          const totalPlays = decodeAudienceSizeResponseIntoAudienceSize(
            responseJson
          );
          resolve(totalPlays);
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

const fetchCurrentPodcastsPlayData = (podcast: Podcast) =>
  Promise.props({
    audienceSize: fetchCurrentPodcastsAudienceSize(podcast),
    allTimePlayCount: fetchCurrentPodcastsTotalPlays(podcast),
  });

export { fetchCurrentPodcastsPlayData };
