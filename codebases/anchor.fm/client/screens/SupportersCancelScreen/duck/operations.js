import actions from './actions';
import AnchorAPI from '../../../modules/AnchorAPI';

const cancelFetch = (stationId, cancelCode, _csrf) => dispatch => {
  dispatch(actions.cancelFetchStart());

  AnchorAPI.cancelSupportForStation(stationId, cancelCode, _csrf)
    .then(() => {
      dispatch(actions.cancelFetchSucceeded());
      dispatch(actions.completeCancel());
    })
    .catch(() => {
      dispatch(actions.cancelFetchFailed());
    });
};

const fetchPodcastData = webStationId => dispatch => {
  dispatch(actions.fetchStationIdBegin());

  dispatch(actions.fetchStationIdSuccess(webStationId));
  return AnchorAPI.getPodcastMetadata(webStationId);
};

const setupStoreForInitialRender = vanitySlug => dispatch => {
  dispatch(actions.setIsPageLoading(true));
  AnchorAPI.getStationIdForVanityName(vanitySlug)
    .then(webStationId => dispatch(fetchPodcastData(webStationId)))
    .then(podcastMetadata => {
      dispatch(actions.setIsPageLoading(false));
      return dispatch(
        actions.fetchPodcastMetadataSuccess(podcastMetadata)
      ).catch(err => {
        dispatch(actions.fetchPodcastMetadataFailure(err));
      });
    })
    .catch(err => {
      throw new Error(
        `Could not find station id for vanity name: ${vanitySlug}`
      );
    });
};

export default {
  cancelFetch,
  fetchPodcastData,
  setupStoreForInitialRender,
};
