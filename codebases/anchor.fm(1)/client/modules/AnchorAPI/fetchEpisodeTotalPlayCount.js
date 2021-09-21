import * as Bluebird from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const fetchEpisodeTotalPlayCount = webEpisodeId =>
  new Promise((resolve, reject) => {
    fetch(
      `/api/proxy/v3/analytics/episode/webEpisodeId:${webEpisodeId}/totalPlays`,
      {
        credentials: 'same-origin',
      }
    )
      .then(resolve)
      .catch(reject);
  }).then(response => {
    if (response.ok) {
      return response.json().then(responseJson => responseJson.data.rows[0]);
    }
    const { status, type } = response;
    throw new AnchorAPIError(
      response,
      `Non-200 response status: ${status} (${type})`
    );
  });

export { fetchEpisodeTotalPlayCount };
