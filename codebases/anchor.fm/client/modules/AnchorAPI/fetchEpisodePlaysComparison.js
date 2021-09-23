import * as Bluebird from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const decodePlaysResponseJson = json =>
  json.data.rows.reduce(
    (accum, row) => [
      ...accum,
      {
        name: row[0],
        playCount: row[1],
        publishedDateEpochTime: row[2],
      },
    ],
    []
  );

const fetchEpisodePlaysComparison = ({ webEpisodeId }) =>
  new Promise((resolve, reject) => {
    fetch(
      `/api/proxy/v3/analytics/episode/webEpisodeId:${webEpisodeId}/comparison`,
      {
        credentials: 'same-origin',
      }
    )
      .then(resolve)
      .catch(reject);
  }).then(response => {
    if (response.ok) {
      return response
        .json()
        .then(responseJson => decodePlaysResponseJson(responseJson));
    }
    const { status, type } = response;
    throw new AnchorAPIError(
      response,
      `Non-200 response status: ${status} (${type})`
    );
  });

export { fetchEpisodePlaysComparison };
