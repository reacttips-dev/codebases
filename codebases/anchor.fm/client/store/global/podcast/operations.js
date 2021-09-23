import actions from './actions';
import { fetchAndConstructPodcastObject } from '../../../modules/AnchorAPI/fetchCurrentUsersPodcast';

const { setPodcastDataFetchStatus, setPodcast } = actions;

const fetchPodcastAndSet = (page = null, limit = null) => dispatch => {
  dispatch(setPodcastDataFetchStatus('loading'));

  return fetchAndConstructPodcastObject(page, limit)
    .then(podcast => {
      dispatch(setPodcast(podcast));
      dispatch(setPodcastDataFetchStatus('success'));

      return podcast;
    })
    .catch(() => dispatch(setPodcastDataFetchStatus('error')));
};

const getIsOptedOutOfDistributionFromPodcastStatus = podcastStatus => {
  const isOptedOutFromDatabase = podcastStatus === 'optedout';
  return isOptedOutFromDatabase;
};

export default {
  fetchPodcastAndSet,
  getIsOptedOutOfDistributionFromPodcastStatus,
};
