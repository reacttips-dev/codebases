import { Dispatch } from 'redux';
import { duckOperations as _episodesByIdDuckOperations } from './_episodesById';
import { duckOperations as _podcastDuckOperations } from './_podcast';

const fetchAndUpdateAllData = () => (
  dispatch: Dispatch<any>,
  getState?: any
) => {
  return new Promise((resolve, reject) => {
    _podcastDuckOperations
      .fetchPodcastAndUpdate({
        shouldLoadPlayData: true,
        shouldLoadWallet: true,
      })(dispatch, getState)
      .then(() => {
        return _episodesByIdDuckOperations.fetchEpisodesByIdAndSet()(
          dispatch,
          getState
        );
      })
      .then(() => {
        const { _podcast, _episodesById } = getState();
        resolve({ _podcast, _episodesById });
      })
      .catch(reject);
  });
};

export default {
  fetchAndUpdateAllData,
};
