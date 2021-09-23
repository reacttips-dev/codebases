import * as Bluebird from 'bluebird';
import AnchorAPIError from './AnchorAPIError';
import { getSecondsInTimeInterval } from '../Date/index.ts';

const decodePlaysResponseJson = json =>
  json.data.rows.reduce(
    (accum, row) => ({
      ...accum,
      [`${row[0]}`]: {
        playCount: row[1],
      },
    }),
    {}
  );

const getEpisodePlaysByDateRangeUrl = ({
  webEpisodeId,
  timeInterval,
  startDate,
  endDate,
  maxCount = 3,
}) => {
  const intervalInSeconds = `&timeInterval=${getSecondsInTimeInterval(
    timeInterval
  )}`;
  const timeRangeStart = startDate ? `&timeRangeStart=${startDate}` : '';
  const timeRangeEnd = endDate ? `&timeRangeEnd=${endDate}` : '';
  const limit = `&limit=${maxCount}`;
  const params = [intervalInSeconds, timeRangeStart, timeRangeEnd, limit].join(
    ''
  );
  return `/api/proxy/v3/analytics/episode/webEpisodeId:${webEpisodeId}/plays?${params}`;
};

const fetchEpisodePlaysByDateRange = ({
  webEpisodeId,
  timeInterval,
  startDate,
  endDate,
  maxCount = 3,
}) =>
  new Promise((resolve, reject) => {
    const url = getEpisodePlaysByDateRangeUrl({
      webEpisodeId,
      timeInterval,
      startDate,
      endDate,
      maxCount,
    });
    fetch(url, {
      credentials: 'same-origin',
    })
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

export { fetchEpisodePlaysByDateRange, getEpisodePlaysByDateRangeUrl };
