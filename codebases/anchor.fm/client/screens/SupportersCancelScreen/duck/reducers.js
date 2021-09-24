import { combineReducers } from 'redux';
import types from './types';

/* State Shape
{
    isCancelComplete: bool,
    isCancellationProcessing: bool
    stationId: string,
    podcastMetadata: {
      podcastName: string
    },
}
*/

const isCancelCompleteReducer = (state = false, action) => {
  switch (action.type) {
    case types.COMPLETED_CANCEL:
      return true;
    default:
      return state;
  }
};
const isCancellationProcessingReducer = (state = false, action) => {
  switch (action.type) {
    case types.CANCEL_FETCH_START:
      return true;
    case types.CANCEL_FETCH_SUCCEEDED:
    case types.CANCEL_FETCH_FAILED:
      return false;
    default:
      return state;
  }
};
const stationIdReducer = (state = null, action) => {
  switch (action.type) {
    case types.FETCH_STATION_ID_SUCCESS:
      return action.payload.stationId;
    default:
      return state;
  }
};
const podcastMetadataReducer = (state = { podcastName: '' }, action) => {
  switch (action.type) {
    case types.FETCH_PODCAST_METADATA_SUCCESS:
      return action.payload.podcastMetadata;
    default:
      return state;
  }
};
const isPageLoadingReducer = (state = true, action) => {
  switch (action.type) {
    case types.SET_IS_PAGE_LOADING:
      return action.payload.isPageLoading;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isCancelComplete: isCancelCompleteReducer,
  isCancellationProcessing: isCancellationProcessingReducer,
  stationId: stationIdReducer,
  podcastMetadata: podcastMetadataReducer,
  isPageLoading: isPageLoadingReducer,
});

export default reducer;
