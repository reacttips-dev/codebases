import types from './types';

const completeCancel = () => ({
  type: types.COMPLETED_CANCEL,
});

const cancelFetchStart = () => ({
  type: types.CANCEL_FETCH_START,
});

const cancelFetchSucceeded = () => ({
  type: types.CANCEL_FETCH_SUCCEEDED,
});

const cancelFetchFailed = () => ({
  type: types.CANCEL_FETCH_FAILED,
});

const fetchStationIdBegin = () => ({
  type: types.FETCH_STATION_ID_BEGIN,
});

const fetchStationIdSuccess = stationId => ({
  type: types.FETCH_STATION_ID_SUCCESS,
  payload: {
    stationId,
  },
});
const setIsPageLoading = isPageLoading => ({
  type: types.SET_IS_PAGE_LOADING,
  payload: {
    isPageLoading,
  },
});

const fetchStationIdFailure = error => ({
  type: types.FETCH_STATION_ID_FAILURE,
  payload: {
    error,
  },
});

const fetchPodcastMetadataBegin = () => ({
  type: types.FETCH_PODCAST_METADATA_BEGIN,
});

const fetchPodcastMetadataSuccess = podcastMetadata => ({
  type: types.FETCH_PODCAST_METADATA_SUCCESS,
  payload: {
    podcastMetadata,
  },
});

const fetchPodcastMetadataFailure = error => ({
  type: types.FETCH_PODCAST_METADATA_FAILURE,
  payload: {
    error,
  },
});

export default {
  completeCancel,
  cancelFetchStart,
  cancelFetchSucceeded,
  cancelFetchFailed,
  fetchStationIdBegin,
  fetchStationIdSuccess,
  fetchStationIdFailure,
  fetchPodcastMetadataBegin,
  fetchPodcastMetadataSuccess,
  fetchPodcastMetadataFailure,
  setIsPageLoading,
};
