import { GiphyFetch } from '@giphy/js-fetch-api';
import memoizeOne from 'memoize-one';

// eslint-disable-next-line @trello/no-module-logic
export const getGiphyApi = memoizeOne(
  () => new GiphyFetch('DOl4PIGDk4srrYJzMgI0KiTrL2qM2IG4'),
);
