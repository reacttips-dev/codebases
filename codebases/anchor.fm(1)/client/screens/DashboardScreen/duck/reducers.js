import { combineReducers } from 'redux';
import types from './types';
import { getEpochTime, getDateInThePast } from '../../../modules/Date';

/* State Shape
{
    isCoverArtModalScreenOpen: bool,
    isShowingRedirectionCheckFailedModal: bool,
    isLoadingAccountMilestonesReducer: bool,
    playsData: [playsData]
    isShowingPushToMobileModal: bool,
}
*/

const isCoverArtModalScreenOpenReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_COVER_ART_MODAL_SCREEN_OPEN:
      return action.payload.isCoverArtModalScreenOpen;
    default:
      return state;
  }
};

const isShowingRedirectionCheckFailedModalReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_REDIRECTION_CHECK_FAILED_MODAL:
      return action.payload.isShowingRedirectionCheckFailedModal;
    default:
      return state;
  }
};
const isShowingPushToMobileModalReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_PUSH_TO_MOBILE_MODAL:
      return action.payload.isShowingPushToMobileModal;
    default:
      return state;
  }
};

const isShowingRedirectionCheckSucceededModalReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_REDIRECTION_CHECK_SUCCEEDED_MODAL:
      return action.payload.isShowingRedirectionCheckSucceededModal;
    default:
      return state;
  }
};

const isLoadingAccountMilestonesReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_LOADING_ACCOUNT_MILESTONES:
      return action.payload.isLoadingAccountMilestones;
    default:
      return state;
  }
};

const playsDataReducer = (state = [], action) => {
  switch (action.type) {
    case types.SET_PLAYS_DATA:
      return action.payload.playsData;
    default:
      return state;
  }
};

const topPlayedEpisodesReducer = (state = [], action) => {
  switch (action.type) {
    case types.SET_TOP_PLAYED_EPISODES:
      return action.payload.topPlayedEpisodes;
    default:
      return state;
  }
};

const appPlaysReducer = (state = { isLoading: true, plays: [] }, action) => {
  switch (action.type) {
    case types.SET_APP_PLAYS:
      return action.payload.appPlays;
    default:
      return state;
  }
};

const devicePlaysReducer = (state = { isLoading: true, plays: [] }, action) => {
  switch (action.type) {
    case types.SET_DEVICE_PLAYS:
      return action.payload.devicePlays;
    default:
      return state;
  }
};

const geoPlaysReducer = (state = null, action) => {
  switch (action.type) {
    case types.SET_GEO_PLAYS:
      return action.payload.geoPlays;
    default:
      return state;
  }
};

const donutChartTypeReducer = (state = 'apps', action) => {
  switch (action.type) {
    case types.SET_DONUT_CHART_TYPE:
      return action.payload.donutChartType;
    default:
      return state;
  }
};

const dateRangeReducer = (
  state = {
    startDateEpoch: getEpochTime(getDateInThePast(new Date(), 180)),
    endDateEpoch: getEpochTime(new Date()),
  },
  action
) => {
  switch (action.type) {
    case types.SET_DATE_RANGE:
      return action.payload.dateRange;
    default:
      return state;
  }
};

const scaleReducer = (state = 'week', action) => {
  switch (action.type) {
    case types.SET_SCALE:
      return action.payload.scale;
    default:
      return state;
  }
};

const isLoadingPlaysDataReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_LOADING_PLAYS_DATA:
      return action.payload.isLoadingPlaysData;
    default:
      return state;
  }
};

const isLoadingTopPlayedEpisodesReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_LOADING_TOP_PLAYED_EPISODES:
      return action.payload.isLoadingTopPlayedEpisodes;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isCoverArtModalScreenOpen: isCoverArtModalScreenOpenReducer,
  isLoadingAccountMilestones: isLoadingAccountMilestonesReducer,
  isShowingRedirectionCheckFailedModal: isShowingRedirectionCheckFailedModalReducer,
  isShowingRedirectionCheckSucceededModal: isShowingRedirectionCheckSucceededModalReducer,
  playsData: playsDataReducer,
  topPlayedEpisodes: topPlayedEpisodesReducer,
  appPlays: appPlaysReducer,
  devicePlays: devicePlaysReducer,
  donutChartType: donutChartTypeReducer,
  geoPlays: geoPlaysReducer,
  dateRange: dateRangeReducer,
  scale: scaleReducer,
  isLoadingPlaysData: isLoadingPlaysDataReducer,
  isLoadingTopPlayedEpisodes: isLoadingTopPlayedEpisodesReducer,
  isShowingPushToMobileModal: isShowingPushToMobileModalReducer,
});

export default reducer;
