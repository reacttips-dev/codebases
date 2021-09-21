import Promise from 'bluebird';
import actions from './actions';
import { AnchorAPI } from '../../modules/AnchorAPI';

const { updatePodcast } = actions;

// TODO: Add fetch states: start, succeeded, failed
// TODO: Convert to async/await (ask Jeff)
//       When there is conditionals in promises or building an object, async/await might be better
const fetchPodcastAndUpdate = ({
  shouldLoadPlayData = false,
  shouldLoadWallet = false,
} = {}) => (dispatch, getState) =>
  AnchorAPI.fetchCurrentUsersPodcast()
    .then(podcast => {
      dispatch(updatePodcast(podcast));
      return Promise.resolve(podcast);
    })
    .then(podcast => {
      if (shouldLoadPlayData) {
        dispatch(
          updatePodcast({
            ...podcast,
            playDataRemoteData: {
              kind: 'loading',
            },
          })
        );
        return AnchorAPI.fetchCurrentPodcastsPlayData(podcast)
          .then(playData =>
            Promise.resolve({
              ...podcast,
              playDataRemoteData: {
                kind: 'success',
                data: playData,
              },
            })
          )
          .catch(err =>
            Promise.resolve({
              ...podcast,
              playDataRemoteData: {
                kind: 'failure',
                error: err,
              },
            })
          );
      }
      return Promise.resolve(podcast);
    })
    .then(podcast => {
      dispatch(updatePodcast(podcast));
      return Promise.resolve(podcast);
    })
    .then(podcast => {
      if (shouldLoadWallet) {
        dispatch(
          updatePodcast({
            ...podcast,
            walletRemoteData: {
              kind: 'loading',
            },
          })
        );
        return AnchorAPI.fetchCurrentPodcastsWallet()
          .then(wallet =>
            Promise.resolve({
              ...podcast,
              walletRemoteData: {
                kind: 'success',
                data: wallet,
              },
            })
          )
          .catch(err =>
            Promise.resolve({
              ...podcast,
              walletRemoteData: {
                kind: 'failure',
                error: err,
              },
            })
          );
      }
      return Promise.resolve(podcast);
    })
    .then(podcast => {
      dispatch(updatePodcast(podcast));
      return Promise.resolve(podcast);
    })
    .catch(() => {
      dispatch(updatePodcast({ kind: 'error' }));
    });

export default {
  fetchPodcastAndUpdate,
};
